# Generated by Django 5.0.5 on 2024-05-08 19:31

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0003_profile"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="followers",
            field=models.ManyToManyField(
                blank=True, related_name="following", to="api.profile"
            ),
        ),
        migrations.AlterField(
            model_name="profile",
            name="cover_photo",
            field=models.ImageField(blank=True, null=True, upload_to="cover_pics/"),
        ),
        migrations.AlterField(
            model_name="profile",
            name="profile_picture",
            field=models.ImageField(blank=True, null=True, upload_to="profile_pics/"),
        ),
    ]