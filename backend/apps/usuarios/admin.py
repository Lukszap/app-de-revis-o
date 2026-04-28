from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'name', 'is_active', 'streak_days', 'created_at']
    list_filter = ['is_active', 'is_staff', 'created_at']
    search_fields = ['email', 'name']
    ordering = ['-created_at']
    readonly_fields = ['id', 'created_at']

    fieldsets = [
        (None, {'fields': ['email', 'password']}),
        ('Informações Pessoais', {'fields': ['name', 'avatar_url']}),
        ('Streak', {'fields': ['streak_days', 'last_study_date']}),
        ('Permissões', {'fields': ['is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions']}),
        ('Datas', {'fields': ['created_at']}),
    ]

    add_fieldsets = [
        (None, {
            'classes': ['wide'],
            'fields': ['email', 'name', 'password1', 'password2'],
        }),
    ]
