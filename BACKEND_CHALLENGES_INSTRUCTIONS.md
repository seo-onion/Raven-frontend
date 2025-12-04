# Backend Instructions for Challenges Feature

Please apply the following changes to the backend codebase to support the new Challenges feature.

## 1. Update Models (`users/models.py`)

Add the following models to `users/models.py`. Ensure you import `Incubator` and `Startup` models if they are not already available in the scope.

```python
from django.db import models
from django.utils.translation import gettext_lazy as _

class Challenge(models.Model):
    STATUS_CHOICES = (
        ('OPEN', 'Open'),
        ('CONCLUDED', 'Concluded'),
    )

    incubator = models.ForeignKey('users.Incubator', on_delete=models.CASCADE, related_name='challenges')
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField()
    budget = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    deadline = models.DateField(blank=True, null=True)
    required_technologies = models.CharField(max_length=255, help_text="Comma-separated list of technologies")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    @property
    def applicant_count(self):
        return self.applications.count()


class ChallengeApplication(models.Model):
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name='applications')
    startup = models.ForeignKey('users.Startup', on_delete=models.CASCADE, related_name='challenge_applications')
    text_solution = models.TextField()
    
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('challenge', 'startup')

    def __str__(self):
        return f"{self.startup.company_name} - {self.challenge.title}"
```

## 2. Create Serializers (`users/serializers/challenges.py`)

Create a new file `users/serializers/challenges.py` (or add to an existing serializers file) with the following content:

```python
from rest_framework import serializers
from users.models import Challenge, ChallengeApplication

class ChallengeSerializer(serializers.ModelSerializer):
    applicant_count = serializers.IntegerField(read_only=True)
    incubator = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Challenge
        fields = [
            'id', 'incubator', 'title', 'subtitle', 'description', 
            'budget', 'deadline', 'required_technologies', 'status', 
            'applicant_count', 'created', 'updated'
        ]
        read_only_fields = ['id', 'created', 'updated', 'incubator']

    def create(self, validated_data):
        # Automatically assign the incubator from the user's profile
        user = self.context['request'].user
        if hasattr(user, 'incubator_profile'):
            validated_data['incubator'] = user.incubator_profile
        return super().create(validated_data)


class ChallengeApplicationSerializer(serializers.ModelSerializer):
    startup_name = serializers.CharField(source='startup.company_name', read_only=True)
    startup = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ChallengeApplication
        fields = [
            'id', 'challenge', 'startup', 'startup_name', 
            'text_solution', 'created', 'updated'
        ]
        read_only_fields = ['id', 'created', 'updated', 'startup']

    def create(self, validated_data):
        # Automatically assign the startup from the user's profile
        user = self.context['request'].user
        if hasattr(user, 'startup_profile'):
            validated_data['startup'] = user.startup_profile
        return super().create(validated_data)
```

## 3. Create Views (`users/views_challenges.py`)

Create a new file `users/views_challenges.py` with the following content:

```python
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from users.models import Challenge, ChallengeApplication
from users.serializers.challenges import ChallengeSerializer, ChallengeApplicationSerializer

class ChallengeViewSet(viewsets.ModelViewSet):
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'incubator':
            # Incubators see only their own challenges
            return Challenge.objects.filter(incubator__user=user)
        elif user.user_type == 'startup':
            # Startups see all OPEN challenges
            return Challenge.objects.filter(status='OPEN')
        return Challenge.objects.none()

    def perform_create(self, serializer):
        if self.request.user.user_type != 'incubator':
            raise permissions.PermissionDenied("Only incubators can create challenges.")
        serializer.save(incubator=self.request.user.incubator_profile)


class ChallengeApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ChallengeApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'incubator':
            # Incubators see applications for their challenges
            return ChallengeApplication.objects.filter(challenge__incubator__user=user)
        elif user.user_type == 'startup':
            # Startups see only their own applications
            return ChallengeApplication.objects.filter(startup__user=user)
        return ChallengeApplication.objects.none()

    def perform_create(self, serializer):
        if self.request.user.user_type != 'startup':
            raise permissions.PermissionDenied("Only startups can apply to challenges.")
        serializer.save(startup=self.request.user.startup_profile)
```

## 4. Update URLs (`users/urls.py`)

Register the new viewsets in your `urls.py`.

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views_challenges import ChallengeViewSet, ChallengeApplicationViewSet

router = DefaultRouter()
# ... existing routes ...
router.register(r'challenges', ChallengeViewSet, basename='challenge')
router.register(r'challenge-applications', ChallengeApplicationViewSet, basename='challenge-application')

urlpatterns = [
    path('', include(router.urls)),
    # ... existing paths ...
]
```

## 5. Run Migrations

After applying these changes, remember to run:

```bash
python manage.py makemigrations
python manage.py migrate
```
