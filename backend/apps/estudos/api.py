from datetime import date

from ninja import Router
from ninja.errors import HttpError

from apps.flashcards.models import Card
from apps.usuarios.models import User
from core.auth import JWTAuth

from .models import Review
from .schemas import DueCardOut, ReviewResult, ReviewSubmit, StudyStats, SyncInput, SyncResult
from .sm2 import calculate_sm2, get_due_cards, get_new_cards

router = Router(tags=['study'])


def update_user_streak(user: User):
    """Atualiza o streak do usuário baseado na última data de estudo."""
    from datetime import timedelta
    
    today = date.today()
    
    if user.last_study_date is None:
        # Primeira vez estudando
        user.streak_days = 1
    elif user.last_study_date == today:
        # Já estudou hoje, não incrementa
        pass
    elif user.last_study_date == today - timedelta(days=1):
        # Estudou ontem, incrementa streak
        user.streak_days += 1
    else:
        # Quebrou o streak, reinicia
        user.streak_days = 1
    
    user.last_study_date = today
    user.save()


@router.get('/due', response=list[DueCardOut], auth=JWTAuth())
def get_due(request):
    user: User = request.auth
    reviews = get_due_cards(user.id)
    
    result = []
    for review in reviews:
        result.append(DueCardOut(
            id=review.id,
            card_id=review.card.id,
            front=review.card.front,
            back=review.card.back,
            deck_id=review.card.deck.id,
            deck_title=review.card.deck.title,
            easiness=review.easiness,
            interval=review.interval,
            repetitions=review.repetitions,
            next_review=review.next_review,
        ))
    return result


@router.post('/review', response=ReviewResult, auth=JWTAuth())
def submit_review(request, data: ReviewSubmit):
    user: User = request.auth
    
    if not 0 <= data.quality <= 5:
        raise HttpError(400, 'Quality deve estar entre 0 e 5')
    
    try:
        card = Card.objects.get(id=data.card_id)
    except Card.DoesNotExist:
        raise HttpError(404, 'Card não encontrado')
    
    # Verificar se card pertence ao usuário ou é público
    if card.deck.owner != user and not card.deck.is_public:
        raise HttpError(403, 'Sem permissão')
    
    # Busca review existente desse card para esse usuário
    review = Review.objects.filter(user=user, card=card).first()

    if review:
        # Já revisou antes — aplica SM-2 sobre os valores anteriores
        sm2_result = calculate_sm2(
            quality=data.quality,
            easiness=review.easiness,
            interval=review.interval,
            repetitions=review.repetitions,
        )
        review.quality = data.quality
        review.easiness = sm2_result['easiness']
        review.interval = sm2_result['interval']
        review.repetitions = sm2_result['repetitions']
        review.next_review = sm2_result['next_review']
        review.synced = True
        review.save()
        result = sm2_result
    else:
        # Primeira revisão desse card
        sm2_result = calculate_sm2(
            quality=data.quality,
            easiness=2.5,
            interval=1,
            repetitions=0,
        )
        review = Review.objects.create(
            user=user,
            card=card,
            quality=data.quality,
            easiness=sm2_result['easiness'],
            interval=sm2_result['interval'],
            repetitions=sm2_result['repetitions'],
            next_review=sm2_result['next_review'],
            synced=True,
        )
        result = sm2_result
    
    # Atualizar streak do usuário
    update_user_streak(user)
    
    return ReviewResult(
        easiness=result['easiness'],
        interval=result['interval'],
        repetitions=result['repetitions'],
        next_review=result['next_review'],
    )


@router.get('/stats', response=StudyStats, auth=JWTAuth())
def get_stats(request):
    user: User = request.auth
    today = date.today()
    
    total_reviews = Review.objects.filter(user=user).count()
    due_today = Review.objects.filter(user=user, next_review__lte=today).count()
    new_cards = get_new_cards(user.id).count()
    
    return StudyStats(
        total_reviews=total_reviews,
        current_streak=user.streak_days,
        due_today=due_today,
        new_cards=new_cards,
        last_study_date=user.last_study_date,
    )


@router.post('/sync', response=SyncResult, auth=JWTAuth())
def sync_offline(request, data: SyncInput):
    user: User = request.auth
    
    processed = 0
    errors = []
    
    # Ordenar por data cronológica
    sorted_reviews = sorted(data.reviews, key=lambda r: r.reviewed_at)
    
    for review_data in sorted_reviews:
        try:
            card = Card.objects.get(id=review_data.card_id)
            
            # Verificar permissão
            if card.deck.owner != user and not card.deck.is_public:
                errors.append(f'Card {review_data.card_id}: sem permissão')
                continue
            
            if not 0 <= review_data.quality <= 5:
                errors.append(f'Card {review_data.card_id}: quality inválida')
                continue
            
            # Busca review existente
            review = Review.objects.filter(user=user, card=card).first()

            if review:
                # Aplica SM-2 sobre valores anteriores
                sm2_result = calculate_sm2(
                    quality=review_data.quality,
                    easiness=review.easiness,
                    interval=review.interval,
                    repetitions=review.repetitions,
                )
                review.quality = review_data.quality
                review.easiness = sm2_result['easiness']
                review.interval = sm2_result['interval']
                review.repetitions = sm2_result['repetitions']
                review.next_review = sm2_result['next_review']
                review.synced = False
                review.save()
            else:
                # Primeira revisão
                sm2_result = calculate_sm2(
                    quality=review_data.quality,
                    easiness=2.5,
                    interval=1,
                    repetitions=0,
                )
                Review.objects.create(
                    user=user,
                    card=card,
                    quality=review_data.quality,
                    easiness=sm2_result['easiness'],
                    interval=sm2_result['interval'],
                    repetitions=sm2_result['repetitions'],
                    next_review=sm2_result['next_review'],
                    synced=False,
                )
            
            processed += 1
            
        except Card.DoesNotExist:
            errors.append(f'Card {review_data.card_id}: não encontrado')
        except Exception as e:
            errors.append(f'Card {review_data.card_id}: {str(e)}')
    
    # Atualizar streak se processou algo
    if processed > 0:
        update_user_streak(user)
    
    return SyncResult(processed=processed, errors=errors)
