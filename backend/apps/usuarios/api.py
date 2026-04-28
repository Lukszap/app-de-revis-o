from django.contrib.auth.hashers import check_password, make_password
from ninja import Router
from ninja.errors import HttpError

from core.auth import JWTAuth, create_access_token, create_refresh_token, RefreshTokenValidator

from .models import User
from .schemas import AuthResponse, TokenRefresh, TokenResponse, UserCreate, UserLogin, UserOut

router = Router(tags=['auth'])


def user_to_dict(user: User) -> dict:
    return {
        'id': user.id,
        'email': user.email,
        'name': user.name,
        'avatar_url': user.avatar_url or '',
        'streak_days': user.streak_days,
        'last_study_date': user.last_study_date,
        'created_at': user.created_at,
    }


@router.post('/register', response=AuthResponse)
def register(request, data: UserCreate):
    if User.objects.filter(email=data.email).exists():
        raise HttpError(400, 'Email já cadastrado')
    
    user = User.objects.create(
        email=data.email,
        name=data.name,
        password=make_password(data.password),
    )
    
    return AuthResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
        user=UserOut(**user_to_dict(user)),
    )


@router.post('/login', response=AuthResponse)
def login(request, data: UserLogin):
    try:
        user = User.objects.get(email=data.email)
    except User.DoesNotExist:
        raise HttpError(401, 'Credenciais inválidas')
    
    if not check_password(data.password, user.password):
        raise HttpError(401, 'Credenciais inválidas')
    
    return AuthResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
        user=UserOut(**user_to_dict(user)),
    )


@router.post('/refresh', response=TokenResponse)
def refresh_token(request, data: TokenRefresh):
    try:
        user_id = RefreshTokenValidator.validate(data.refresh_token)
        return TokenResponse(access_token=create_access_token(user_id))
    except ValueError as e:
        raise HttpError(401, str(e))


@router.get('/me', response=UserOut, auth=JWTAuth())
def get_me(request):
    return UserOut(**user_to_dict(request.auth))
