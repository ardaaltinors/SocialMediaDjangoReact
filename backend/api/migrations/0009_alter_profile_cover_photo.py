# Generated by Django 5.0.5 on 2024-05-23 08:42

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0008_post_video_alter_post_image"),
    ]

    operations = [
        migrations.AlterField(
            model_name="profile",
            name="cover_photo",
            field=models.ImageField(
                blank=True,
                default=api.models.get_default_cover_photo,
                null=True,
                upload_to="cover_pics/",
            ),
        ),
    ]