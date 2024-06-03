# Generated by Django 5.0.5 on 2024-05-26 10:15

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0014_alter_post_caption"),
    ]

    operations = [
        migrations.AlterField(
            model_name="post",
            name="caption",
            field=models.TextField(
                validators=[django.core.validators.MinLengthValidator(1)]
            ),
        ),
    ]
