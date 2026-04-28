from datetime import date, datetime
from uuid import UUID

from ninja import Schema


class ReviewSubmit(Schema):
    card_id: UUID
    quality: int  # 0-5


class DueCardOut(Schema):
    id: UUID
    card_id: UUID
    front: str
    back: str
    deck_id: UUID
    deck_title: str
    easiness: float
    interval: int
    repetitions: int
    next_review: date


class ReviewResult(Schema):
    easiness: float
    interval: int
    repetitions: int
    next_review: date


class StudyStats(Schema):
    total_reviews: int
    current_streak: int
    due_today: int
    new_cards: int
    last_study_date: date | None


class OfflineReview(Schema):
    card_id: UUID
    quality: int
    reviewed_at: datetime


class SyncInput(Schema):
    reviews: list[OfflineReview]


class SyncResult(Schema):
    processed: int
    errors: list[str]
