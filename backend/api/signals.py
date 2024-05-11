from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Comment, Notification

@receiver(post_save, sender=Comment)
def send_notification_on_comment(sender, instance, created, **kwargs):
    if created:
        post = instance.post
        recipient = post.user
        message = f"{instance.user.username} commented on your post."
        Notification.objects.create(recipient=recipient, message=message)
