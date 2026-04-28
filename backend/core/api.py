from ninja import NinjaAPI

from apps.estudos.api import router as estudos_router
from apps.flashcards.api import router as flashcards_router
from apps.usuarios.api import router as usuarios_router

api = NinjaAPI(
    title='FlashMind API',
    version='1.0.0',
    description='API de flashcards com spaced repetition (SM-2)',
    docs_url='/docs',
)

# Registrando routers com prefixos
api.add_router('/auth', usuarios_router)
api.add_router('', flashcards_router)  # /decks, /cards
api.add_router('/study', estudos_router)
