from datetime import date, timedelta

from ninja import Router
from ninja.errors import HttpError

from apps.estudos.models import Review
from apps.usuarios.models import User
from core.auth import JWTAuth

from .models import Card, Deck
from .schemas import CardCreate, CardOut, CardUpdate, DeckCreate, DeckOut, DeckUpdate

router = Router(tags=['decks'])


@router.get('/decks', response=list[DeckOut], auth=JWTAuth())
def list_decks(request):
    user: User = request.auth
    # Decks do usuário + decks públicos de outros
    decks = Deck.objects.filter(owner=user) | Deck.objects.filter(is_public=True).exclude(owner=user)
    
    result = []
    for deck in decks:
        result.append(DeckOut(
            id=deck.id,
            title=deck.title,
            description=deck.description,
            is_public=deck.is_public,
            color=deck.color,
            created_at=deck.created_at,
            updated_at=deck.updated_at,
            card_count=deck.cards.count(),
        ))
    return result


@router.post('/decks', response=DeckOut, auth=JWTAuth())
def create_deck(request, data: DeckCreate):
    user: User = request.auth
    deck = Deck.objects.create(
        owner=user,
        title=data.title,
        description=data.description,
        is_public=data.is_public,
        color=data.color,
    )
    return DeckOut(
        id=deck.id,
        title=deck.title,
        description=deck.description,
        is_public=deck.is_public,
        color=deck.color,
        created_at=deck.created_at,
        updated_at=deck.updated_at,
        card_count=0,
    )


@router.get('/decks/{deck_id}', response=DeckOut, auth=JWTAuth())
def get_deck(request, deck_id: str):
    user: User = request.auth
    try:
        deck = Deck.objects.get(id=deck_id)
    except Deck.DoesNotExist:
        raise HttpError(404, 'Deck não encontrado')
    
    # Verificar acesso (próprio ou público)
    if deck.owner != user and not deck.is_public:
        raise HttpError(403, 'Sem permissão')
    
    return DeckOut(
        id=deck.id,
        title=deck.title,
        description=deck.description,
        is_public=deck.is_public,
        color=deck.color,
        created_at=deck.created_at,
        updated_at=deck.updated_at,
        card_count=deck.cards.count(),
    )


@router.put('/decks/{deck_id}', response=DeckOut, auth=JWTAuth())
def update_deck(request, deck_id: str, data: DeckUpdate):
    user: User = request.auth
    try:
        deck = Deck.objects.get(id=deck_id, owner=user)
    except Deck.DoesNotExist:
        raise HttpError(404, 'Deck não encontrado')
    
    if data.title is not None:
        deck.title = data.title
    if data.description is not None:
        deck.description = data.description
    if data.is_public is not None:
        deck.is_public = data.is_public
    if data.color is not None:
        deck.color = data.color
    
    deck.save()
    return DeckOut(
        id=deck.id,
        title=deck.title,
        description=deck.description,
        is_public=deck.is_public,
        color=deck.color,
        created_at=deck.created_at,
        updated_at=deck.updated_at,
        card_count=deck.cards.count(),
    )


@router.delete('/decks/{deck_id}', auth=JWTAuth())
def delete_deck(request, deck_id: str):
    user: User = request.auth
    try:
        deck = Deck.objects.get(id=deck_id, owner=user)
    except Deck.DoesNotExist:
        raise HttpError(404, 'Deck não encontrado')
    
    deck.delete()
    return {'success': True}


@router.get('/decks/{deck_id}/cards', response=list[CardOut], auth=JWTAuth())
def list_cards(request, deck_id: str):
    user: User = request.auth
    try:
        deck = Deck.objects.get(id=deck_id)
    except Deck.DoesNotExist:
        raise HttpError(404, 'Deck não encontrado')
    
    if deck.owner != user and not deck.is_public:
        raise HttpError(403, 'Sem permissão')
    
    cards = deck.cards.all()
    return [CardOut(
        id=c.id,
        deck_id=deck.id,
        front=c.front,
        back=c.back,
        created_at=c.created_at,
    ) for c in cards]


@router.post('/decks/{deck_id}/cards', response=CardOut, auth=JWTAuth())
def create_card(request, deck_id: str, data: CardCreate):
    user: User = request.auth
    try:
        deck = Deck.objects.get(id=deck_id, owner=user)
    except Deck.DoesNotExist:
        raise HttpError(404, 'Deck não encontrado')
    
    card = Card.objects.create(
        deck=deck,
        front=data.front,
        back=data.back,
    )
    
    # Criar Review inicial - card novo disponível para revisão IMEDIATAMENTE
    try:
        Review.objects.create(
            user=user,
            card=card,
            quality=0,  # Ainda não estudado
            easiness=2.5,
            interval=0,
            repetitions=0,
            next_review=date.today(),  # Disponível HOJE (não amanhã)
            synced=True,
        )
        print(f"[DEBUG] Review criado para card {card.id} - revisão disponível hoje")
    except Exception as e:
        print(f"[DEBUG] ERRO ao criar Review: {e}")
    
    return CardOut(
        id=card.id,
        deck_id=deck.id,
        front=card.front,
        back=card.back,
        created_at=card.created_at,
    )


@router.put('/cards/{card_id}', response=CardOut, auth=JWTAuth())
def update_card(request, card_id: str, data: CardUpdate):
    user: User = request.auth
    try:
        card = Card.objects.get(id=card_id, deck__owner=user)
    except Card.DoesNotExist:
        raise HttpError(404, 'Card não encontrado')
    
    if data.front is not None:
        card.front = data.front
    if data.back is not None:
        card.back = data.back
    
    card.save()
    return CardOut(
        id=card.id,
        deck_id=card.deck.id,
        front=card.front,
        back=card.back,
        created_at=card.created_at,
    )


@router.delete('/cards/{card_id}', auth=JWTAuth())
def delete_card(request, card_id: str):
    user: User = request.auth
    try:
        card = Card.objects.get(id=card_id, deck__owner=user)
    except Card.DoesNotExist:
        raise HttpError(404, 'Card não encontrado')
    
    card.delete()
    return {'success': True}
