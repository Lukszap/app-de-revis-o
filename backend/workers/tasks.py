# Tarefas do Celery
# Importe aqui para garantir que sejam descobertas

from apps.estudos.tasks import send_study_reminders, update_daily_streaks

__all__ = ['update_daily_streaks', 'send_study_reminders']
