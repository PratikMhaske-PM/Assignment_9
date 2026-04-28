from django.db import models


class Submission(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    age = models.IntegerField()
    phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.email})"
