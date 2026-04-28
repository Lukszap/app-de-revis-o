#!/bin/bash
# Script para subir projeto no GitHub
# Uso: bash setup-github.sh SEU_USERNAME NOME_REPO

USERNAME=$1
REPO=${2:-flashmind}

if [ -z "$USERNAME" ]; then
    echo "Uso: bash setup-github.sh SEU_USERNAME [NOME_REPO]"
    echo "Exemplo: bash setup-github.sh lucas flashmind"
    exit 1
fi

echo "=== Configurando GitHub para $USERNAME/$REPO ==="

# Inicializar git
git init

# Configurar git
git config user.name "$USERNAME"
git config user.email "$USERNAME@users.noreply.github.com"

# Criar .gitignore se não existir
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
*.egg-info/

# Django
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal

# Virtual environments
venv/
ENV/
env/
.venv/

# IDEs
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Environment
.env
EOF

# Adicionar arquivos
git add .

# Commit inicial
git commit -m "🎉 Initial commit: FlashMind - Spaced Repetition System

Features:
- Django 5 + django-ninja REST API
- JWT Authentication
- SM-2 Algorithm for spaced repetition
- Decks and Cards management
- Study tracking with streaks
- Offline sync support
- Docker support (PostgreSQL + Redis + Celery)"

# Conectar ao GitHub
git remote add origin "https://github.com/$USERNAME/$REPO.git"

echo ""
echo "=== Pronto para enviar! ==="
echo "Execute: git push -u origin main"
echo ""
echo "Ou se preferir usar SSH:"
echo "git remote set-url origin git@github.com:$USERNAME/$REPO.git"
