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


@router.get('/new', response=list[DueCardOut], auth=JWTAuth())
def get_new(request):
    """Retorna cards novos (nunca estudados) disponíveis para aprender hoje."""
    user: User = request.auth
    reviews = get_new_cards(user.id)
    
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


@router.get('/demo', response=list[DueCardOut], auth=JWTAuth())
def get_demo_cards(request):
    """Retorna cards de demonstração/teste sempre disponíveis."""
    from uuid import uuid4
    
    # Cards de teste fixos
    demo_cards = [
        DueCardOut(
            id=uuid4(),
            card_id=uuid4(),
            front='Qual a capital do Brasil? 🇧🇷',
            back='Brasília',
            deck_id=uuid4(),
            deck_title='Demo - Geografia',
            easiness=2.5,
            interval=0,
            repetitions=0,
            next_review=date.today(),
        ),
        DueCardOut(
            id=uuid4(),
            card_id=uuid4(),
            front='Quanto é 2 + 2? ➕',
            back='4',
            deck_id=uuid4(),
            deck_title='Demo - Matemática',
            easiness=2.5,
            interval=0,
            repetitions=0,
            next_review=date.today(),
        ),
        DueCardOut(
            id=uuid4(),
            card_id=uuid4(),
            front='O que é Flutter? 📱',
            back='Um framework UI do Google para criar apps nativos',
            deck_id=uuid4(),
            deck_title='Demo - Tecnologia',
            easiness=2.5,
            interval=0,
            repetitions=0,
            next_review=date.today(),
        ),
    ]
    return demo_cards


@router.post('/review', response=ReviewResult, auth=JWTAuth())
def submit_review(request, data: ReviewSubmit):
    user: User = request.auth
    
    # Adapter pattern: mapeia button_pressed (1-4) para quality (0-5)
    BUTTON_TO_QUALITY = {
        1: 1,  # Errei -> quality 1 (zera repetições)
        2: 2,  # Difícil -> quality 2 (mantém/diminui facilidade)
        3: 4,  # Bom -> quality 4 (resposta padrão, aumenta intervalo)
        4: 5,  # Fácil -> quality 5 (aumenta bastante facilidade e intervalo)
    }
    
    if data.button_pressed not in BUTTON_TO_QUALITY:
        raise HttpError(400, 'button_pressed deve ser 1, 2, 3 ou 4')
    
    quality = BUTTON_TO_QUALITY[data.button_pressed]
    
    try:
        card = Card.objects.get(id=data.card_id)
    except Card.DoesNotExist:
        raise HttpError(404, 'Card não encontrado')
    
    # Verificar se card pertence ao usuário ou é público
    if card.deck.owner != user and not card.deck.is_public:
        raise HttpError(403, 'Sem permissão')
    
    # Busca review existente ou cria valores padrão
    try:
        review = Review.objects.get(user=user, card=card)
        # Review existe - usar valores atuais
        current_easiness = review.easiness
        current_interval = review.interval
        current_repetitions = review.repetitions
    except Review.DoesNotExist:
        # Review não existe - usar valores iniciais
        review = None
        current_easiness = 2.5
        current_interval = 0
        current_repetitions = 0
    
    print(f"[DEBUG] Button: {data.button_pressed} -> Quality: {quality}")
    print(f"[DEBUG] Review existe: {review is not None}, Repetitions atual: {current_repetitions}")
    
    # Calcular SM-2
    sm2_result = calculate_sm2(
        quality=quality,
        easiness=current_easiness,
        interval=current_interval,
        repetitions=current_repetitions,
    )
    
    print(f"[DEBUG SM-2] Resultado: {sm2_result}")
    
    # Salvar usando update_or_create para evitar IntegrityError
    review, created = Review.objects.update_or_create(
        user=user,
        card=card,
        defaults={
            'quality': quality,
            'easiness': sm2_result['easiness'],
            'interval': sm2_result['interval'],
            'repetitions': sm2_result['repetitions'],
            'next_review': sm2_result['next_review'],
            'synced': True,
        }
    )
    
    print(f"[DEBUG] Review {'criado' if created else 'atualizado'} com sucesso")
    
    # Atualizar streak do usuário
    update_user_streak(user)
    
    return ReviewResult(
        easiness=sm2_result['easiness'],
        interval=sm2_result['interval'],
        repetitions=sm2_result['repetitions'],
        next_review=sm2_result['next_review'],
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
    
    # Adapter pattern para sync (mesmo mapeamento do submit_review)
    BUTTON_TO_QUALITY = {
        1: 1,  # Errei
        2: 2,  # Difícil
        3: 4,  # Bom
        4: 5,  # Fácil
    }
    
    for review_data in sorted_reviews:
        try:
            card = Card.objects.get(id=review_data.card_id)
            
            # Verificar permissão
            if card.deck.owner != user and not card.deck.is_public:
                errors.append(f'Card {review_data.card_id}: sem permissão')
                continue
            
            if review_data.button_pressed not in BUTTON_TO_QUALITY:
                errors.append(f'Card {review_data.card_id}: button_pressed inválido')
                continue
            
            quality = BUTTON_TO_QUALITY[review_data.button_pressed]
            
            # Busca review existente ou cria valores padrão
            try:
                review = Review.objects.get(user=user, card=card)
                current_easiness = review.easiness
                current_interval = review.interval
                current_repetitions = review.repetitions
            except Review.DoesNotExist:
                review = None
                current_easiness = 2.5
                current_interval = 0
                current_repetitions = 0
            
            # Calcular SM-2
            sm2_result = calculate_sm2(
                quality=quality,
                easiness=current_easiness,
                interval=current_interval,
                repetitions=current_repetitions,
            )
            
            # Salvar usando update_or_create
            Review.objects.update_or_create(
                user=user,
                card=card,
                defaults={
                    'quality': quality,
                    'easiness': sm2_result['easiness'],
                    'interval': sm2_result['interval'],
                    'repetitions': sm2_result['repetitions'],
                    'next_review': sm2_result['next_review'],
                    'synced': False,
                }
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
