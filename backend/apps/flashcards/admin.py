from django.contrib import admin

from .models import Card, Deck


@admin.register(Deck)
class DeckAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'is_public', 'created_at']
    list_filter = ['is_public', 'created_at']
    search_fields = ['title', 'description', 'owner__email']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ['deck', 'front_preview', 'created_at']
    list_filter = ['created_at']
    search_fields = ['front', 'back', 'deck__title']
    readonly_fields = ['id', 'created_at']

    def front_preview(self, obj):
        return obj.front[:50] + '...' if len(obj.front) > 50 else obj.front
    front_preview.short_description = 'Frente'
