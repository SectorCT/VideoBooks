from django.db import models

class TranscriptionCache(models.Model):
    audio_filename = models.CharField(max_length=255, unique=True)  # Unique filename as cache key
    transcription_data = models.JSONField(default=dict)  # Store the entire transcription result as JSON
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for when it was created

    def __str__(self):
        return self.audio_filename

class ImageCache(models.Model):
    text = models.TextField(unique=True)  # Unique prompt to avoid duplicates
    image_base64 = models.TextField()       # Store the base64-encoded image
    created_at = models.DateTimeField(auto_now_add=True)  # To track when it was created

    def __str__(self):
        return self.text