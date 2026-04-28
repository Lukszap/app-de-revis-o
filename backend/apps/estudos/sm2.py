from datetime import date, timedelta
from uuid import UUID

from django.db.models import QuerySet

from .models import Review


def calculate_sm2(quality: int, easiness: float, interval: int, repetitions: int) -> dict:
    """
    Algoritmo SM-2 para spaced repetition.

    quality: 0-5 (0-1 = falhou, 2 = difícil, 3 = ok, 4 = bom, 5 = fácil)
    Retorna dict com: easiness, interval, repetitions, next_review (date)
    """
    if quality < 3:
        # Resposta incorreta: resetar
        repetitions = 0
        interval = 1
    else:
        # Resposta correta
        if repetitions == 0:
            interval = 1
        elif repetitions == 1:
            interval = 6
        else:
            interval = round(interval * easiness)
        repetitions += 1

    # Calcular novo fator de facilidade (ef)
    # Fórmula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    easiness = max(1.3, easiness + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

    # Próxima revisão
    next_review = date.today() + timedelta(days=interval)

    return {
        'easiness': round(easiness, 2),
        'interval': interval,
        'repetitions': repetitions,
        'next_review': next_review,
    }


def get_due_cards(user_id: UUID) -> QuerySet:
    """Retorna cards devidos para revisão hoje ou atrasados."""
    today = date.today()
    return Review.objects.filter(
        user_id=user_id,
        next_review__lte=today
    ).select_related('card', 'card__deck')


def get_new_cards(user_id: UUID, limit: int = 20) -> QuerySet:
    """Retorna cards novos que ainda não foram revisados."""
    from apps.flashcards.models import Card

    # Cards que já têm review
    reviewed_card_ids = Review.objects.filter(
        user_id=user_id
    ).values_list('card_id', flat=True)

    # Cards novos (ainda não revisados)
    return Card.objects.filter(
        deck__owner_id=user_id
    ).exclude(
        id__in=reviewed_card_ids
    )[:limit]
