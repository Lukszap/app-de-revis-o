from celery import shared_task

from apps.usuarios.models import User


@shared_task
def update_daily_streaks():
    """Tarefa diária para resetar streaks de usuários que não estudaram ontem."""
    from datetime import date, timedelta
    
    yesterday = date.today() - timedelta(days=1)
    
    # Usuários que estudaram ontem - mantém streak
    # Usuários que não estudaram ontem - streak já foi quebrado no algoritmo
    
    # Resetar streak de quem não estudou em 2 dias
    two_days_ago = date.today() - timedelta(days=2)
    users_to_reset = User.objects.filter(
        last_study_date__lte=two_days_ago,
        streak_days__gt=0
    )
    
    count = users_to_reset.update(streak_days=0)
    
    return f'Reset {count} user streaks'


@shared_task
def send_study_reminders():
    """Tarefa para enviar lembretes de estudo (placeholder)."""
    from .sm2 import get_due_cards
    
    # Aqui você integraria com Firebase Cloud Messaging ou similar
    # para enviar push notifications
    
    return 'Reminders sent'
