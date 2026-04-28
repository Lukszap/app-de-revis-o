FROM python:3.12-slim

WORKDIR /app

# Instalar dependências do sistema para psycopg
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV DJANGO_SETTINGS_MODULE=core.settings.docker

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
