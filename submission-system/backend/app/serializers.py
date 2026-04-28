from rest_framework import serializers
from .models import Submission


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['id', 'full_name', 'email', 'age', 'phone', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_email(self, value):
        normalized = value.lower()
        qs = Submission.objects.filter(email__iexact=normalized)

        # On update, exclude the current instance so it doesn't flag itself
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError("This email is already registered.")

        return normalized