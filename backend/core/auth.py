from datetime import datetime, timedelta
from uuid import UUID

from decouple import config
from jose import JWTError, jwt
from ninja.security import HttpBearer

SECRET_KEY = config('SECRET_KEY')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7


def create_access_token(user_id: UUID, expires_delta: timedelta = None) -> str:
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        'sub': str(user_id),
        'type': 'access',
        'exp': datetime.utcnow() + expires_delta,
        'iat': datetime.utcnow(),
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(user_id: UUID, expires_delta: timedelta = None) -> str:
    if expires_delta is None:
        expires_delta = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode = {
        'sub': str(user_id),
        'type': 'refresh',
        'exp': datetime.utcnow() + expires_delta,
        'iat': datetime.utcnow(),
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


class JWTAuth(HttpBearer):
    def authenticate(self, request, token: str):
        payload = decode_token(token)
        if payload is None:
            return None
        
        # Verificar se é token de acesso
        if payload.get('type') != 'access':
            return None
        
        user_id = payload.get('sub')
        if user_id is None:
            return None
        
        from apps.usuarios.models import User
        try:
            user = User.objects.get(id=user_id)
            return user
        except User.DoesNotExist:
            return None


class RefreshTokenValidator:
    @staticmethod
    def validate(token: str) -> UUID:
        payload = decode_token(token)
        if payload is None:
            raise ValueError('Token inválido')
        
        if payload.get('type') != 'refresh':
            raise ValueError('Token inválido')
        
        user_id = payload.get('sub')
        if user_id is None:
            raise ValueError('Token inválido')
        
        return UUID(user_id)
