# FlashMind - Sistema de Flashcards com Spaced Repetition

## 🎯 Sobre o Projeto

FlashMind é um sistema completo de flashcards utilizando o algoritmo **SM-2** (SuperMemo-2) para spaced repetition (repetição espaçada), técnica cientificamente comprovada para memorização de longo prazo.

## 🏗️ Arquitetura

### Backend (Django 5)
```
backend/
├── apps/
│   ├── usuarios/      # Autenticação JWT, User model com UUID
│   ├── flashcards/    # Decks e Cards (CRUD completo)
│   └── estudos/       # Reviews com SM-2 algorithm
├── core/              # Configurações, auth, API router
└── workers/           # Celery tasks
```

### Algoritmo SM-2
Implementação fiel ao algoritmo original de Piotr Wozniak:

```
EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))

Onde:
- EF = Fator de Facilidade (easiness)
- q = Qualidade da resposta (0-5)
- Intervalo progressivo baseado em repetições anteriores
```

**Regras de intervalo:**
- 1ª revisão: 1 dia
- 2ª revisão: 6 dias
- 3ª+ revisão: round(intervalo_anterior × EF)

## 🚀 Quick Start

### Local (SQLite)
```bash
cd backend
python manage.py runserver
# Acesse: http://localhost:8000/api/docs
```

### Docker (PostgreSQL + Redis)
```bash
docker-compose up --build
```

## 📚 API Documentation

### Autenticação
| Endpoint | Descrição |
|----------|-----------|
| `POST /api/auth/register` | Criar conta |
| `POST /api/auth/login` | Login JWT |
| `POST /api/auth/refresh` | Renovar token |
| `GET /api/auth/me` | Perfil do usuário |

### Decks & Cards
| Endpoint | Descrição |
|----------|-----------|
| `GET /api/decks` | Listar decks |
| `POST /api/decks` | Criar deck |
| `GET /api/decks/{id}` | Detalhes |
| `POST /api/decks/{id}/cards` | Adicionar card |

### Estudos (SM-2)
| Endpoint | Descrição |
|----------|-----------|
| `GET /api/study/due` | Cards para revisar hoje |
| `POST /api/study/review` | Submeter avaliação (0-5) |
| `GET /api/study/stats` | Estatísticas e streak |
| `POST /api/study/sync` | Sincronização offline |

## 🛠️ Stack Tecnológica

- **Framework**: Django 5.0 + django-ninja (REST)
- **Database**: PostgreSQL (prod) / SQLite (dev)
- **Cache/Queue**: Redis + Celery
- **Auth**: JWT (python-jose)
- **Container**: Docker + Docker Compose

## 📁 Estrutura do Monorepo

```
flashmind/
├── backend/           # Django API
│   ├── apps/
│   │   ├── usuarios/
│   │   ├── flashcards/
│   │   └── estudos/
│   ├── core/
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 📝 Licença

MIT License - Livre para uso e modificação.

---

**Autor**: Lucas Zaparoli  
**Criado em**: Abril 2026
