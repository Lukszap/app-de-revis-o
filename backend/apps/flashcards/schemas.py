from datetime import datetime
from uuid import UUID

from ninja import Schema


class DeckCreate(Schema):
    title: str
    description: str = ''
    is_public: bool = False
    color: str = '#6366f1'


class DeckUpdate(Schema):
    title: str | None = None
    description: str | None = None
    is_public: bool | None = None
    color: str | None = None


class DeckOut(Schema):
    id: UUID
    title: str
    description: str
    is_public: bool
    color: str
    created_at: datetime
    updated_at: datetime
    card_count: int


class CardCreate(Schema):
    front: str
    back: str


class CardUpdate(Schema):
    front: str | None = None
    back: str | None = None


class CardOut(Schema):
    id: UUID
    deck_id: UUID
    front: str
    back: str
    created_at: datetime
