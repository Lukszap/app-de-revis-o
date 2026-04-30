# App de Revisão

Sistema de flashcards com spaced repetition usando o algoritmo SM-2.

## Estrutura do Monorepo

```
app de revisao/
├── .venv/                  # Ambiente virtual Python 3.14
├── backend/                # Django 5 + django-ninja
│   ├── apps/
│   │   ├── usuarios/      # Autenticação JWT, User model
│   │   ├── flashcards/    # Decks e Cards
│   │   └── estudos/       # Reviews com SM-2
│   ├── core/              # Configurações Django
│   ├── workers/           # Celery tasks
│   ├── manage.py
│   └── requirements.txt
├── mobile/                 # Flutter app
│   ├── lib/
│   │   ├── main.dart
│   │   ├── models/
│   │   ├── services/
│   │   ├── screens/
│   │   └── widgets/
│   ├── pubspec.yaml
│   └── android/ios/       # Plataformas nativas
└── frontend-web/           # Next.js 15
    ├── src/
    │   ├── app/          # App Router
    │   ├── components/
    │   └── services/
    ├── package.json
    └── next.config.mjs
```

## Tecnologias

- **Backend**: Django 5, django-ninja, PostgreSQL (prod) / SQLite (dev)
- **Mobile**: Flutter 3.29 + Dio + Provider
- **Frontend Web**: Next.js 15 + React 19 + TailwindCSS + shadcn/ui
- **Autenticação**: JWT com python-jose
- **Algoritmo**: SM-2 (spaced repetition)
- **Cache/Tasks**: Redis + Celery

## Comandos

### Desenvolvimento Local (SQLite)

```bash
# Ativar ambiente virtual
.venv\Scripts\Activate.ps1

# Rodar servidor
cd backend
python manage.py runserver

# Acessar documentação
http://localhost:8000/api/docs
```

### Docker (PostgreSQL + Redis + Celery)

```bash
# Subir todos os serviços
docker-compose up --build

# Ou em background
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Parar
docker-compose down

# Resetar volumes
docker-compose down -v
```

**Serviços:**
- `backend`: http://localhost:8000
- `db`: PostgreSQL na porta 5432
- `redis`: Redis na porta 6379
- `celery`: Worker de tarefas em background

### Mobile (Flutter)

```bash
cd mobile

# Instalar dependências
flutter pub get

# Rodar em modo debug
flutter run

# Ou em emulador específico
flutter run -d emulator-5554
```

### Frontend Web (Next.js)

```bash
cd frontend-web

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Perfil do usuário

### Decks e Cards
- `GET /api/decks` - Listar decks
- `POST /api/decks` - Criar deck
- `GET /api/decks/{id}` - Detalhe do deck
- `PUT /api/decks/{id}` - Editar deck
- `DELETE /api/decks/{id}` - Remover deck
- `POST /api/decks/{id}/cards` - Adicionar card
- `PUT /api/cards/{id}` - Editar card
- `DELETE /api/cards/{id}` - Remover card

### Estudos (SM-2)
- `GET /api/study/due` - Cards devidos hoje
- `POST /api/study/review` - Submeter revisão (quality 0-5)
- `GET /api/study/stats` - Estatísticas
- `POST /api/study/sync` - Sincronizar reviews offline
