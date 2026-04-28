import uuid

from django.db import models

from apps.flashcards.models import Card
from apps.usuarios.models import User


class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    quality = models.IntegerField()          # 0-5, avaliação SM-2
    easiness = models.FloatField(default=2.5)
    interval = models.IntegerField(default=1)  # dias
    repetitions = models.IntegerField(default=0)
    next_review = models.DateField()
    reviewed_at = models.DateTimeField(auto_now_add=True)
    synced = models.BooleanField(default=True)  # False = veio do offline

    class Meta:
        db_table = 'estudos_review'
        verbose_name = 'Revisão'
        verbose_name_plural = 'Revisões'
        ordering = ['-reviewed_at']

    def __str__(self):
        return f"{self.user.email} - {self.card.deck.title} ({self.quality})"
