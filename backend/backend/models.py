from django.db import models

class TranscriptionCache(models.Model):
    audio_filename = models.CharField(max_length=255, unique=True)  # Use unique filenames
    transcription = models.TextField()  # Store transcription as text
    created_at = models.DateTimeField(auto_now_add=True)  # Store when the transcription was made

    def __str__(self):
        return self.audio_filename
