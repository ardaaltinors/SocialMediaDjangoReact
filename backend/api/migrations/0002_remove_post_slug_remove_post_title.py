# Generated by Django 5.0.5 on 2024-05-07 19:01

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="post",
            name="slug",
        ),
        migrations.RemoveField(
            model_name="post",
            name="title",
        ),
    ]