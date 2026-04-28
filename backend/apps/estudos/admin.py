from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'card', 'quality', 'easiness', 'interval', 'repetitions', 'next_review', 'synced', 'reviewed_at']
    list_filter = ['quality', 'synced', 'reviewed_at', 'next_review']
    search_fields = ['user__email', 'card__front']
    readonly_fields = ['id', 'reviewed_at']
    date_hierarchy = 'reviewed_at'
