from .base import *

DEBUG = True

ALLOWED_HOSTS = ['*']

# SQLite para desenvolvimento local (sem necessidade de PostgreSQL)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
