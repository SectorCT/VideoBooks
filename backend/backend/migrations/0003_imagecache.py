# Generated by Django 5.1.1 on 2024-10-06 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_remove_transcriptioncache_transcription_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageCache',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(unique=True)),
                ('image_base64', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
