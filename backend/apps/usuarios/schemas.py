from datetime import date, datetime
from uuid import UUID

from ninja import Schema


class UserCreate(Schema):
    email: str
    name: str
    password: str


class UserLogin(Schema):
    email: str
    password: str


class TokenRefresh(Schema):
    refresh_token: str


class UserOut(Schema):
    id: UUID
    email: str
    name: str
    avatar_url: str = ''
    streak_days: int
    last_study_date: date | None
    created_at: datetime


class AuthResponse(Schema):
    access_token: str
    refresh_token: str
    user: UserOut


class TokenResponse(Schema):
    access_token: str


class MeResponse(Schema):
    id: UUID
    email: str
    name: str
    avatar_url: str
    streak_days: int
    last_study_date: date | None
