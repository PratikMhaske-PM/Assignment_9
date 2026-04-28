from django.contrib import admin
from .models import Submission

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'email', 'age', 'phone', 'created_at']
    search_fields = ['full_name', 'email']
