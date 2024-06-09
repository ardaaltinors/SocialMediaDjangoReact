from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Comment, Notification, Post, Profile

User = get_user_model()

@receiver(post_save, sender=Comment)
def send_notification_on_comment(sender, instance, created, **kwargs):
    if created:
        post = instance.post
        recipient = post.user
        comment_preview = instance.text[:24] if len(instance.text) > 24 else instance.text
        message = f"💬{instance.user.username} commented on your post: '{comment_preview}...'"
        Notification.objects.create(recipient=recipient, message=message)
        send_websocket_notification(recipient.id, message)

@receiver(m2m_changed, sender=Post.liked_by.through)
def send_notification_on_like(sender, instance, action, model, pk_set, **kwargs):
    if action == "post_add":
        for user_id in pk_set:
            if instance.user.id != user_id:
                user = User.objects.get(id=user_id)
                message = f"♥️{user.username} liked your post."
                Notification.objects.create(recipient=instance.user, message=message)
                send_websocket_notification(instance.user.id, message)

@receiver(m2m_changed, sender=Profile.followers.through)
def send_notification_on_new_follower(sender, instance, action, model, pk_set, **kwargs):
    if action == "post_add":
        for profile_id in pk_set:
            try:
                recipient_profile = Profile.objects.get(id=profile_id)
                recipient = recipient_profile.user
                follower = instance.user
                message = f"{follower.username} has started following you."
                Notification.objects.create(recipient=recipient, message=message)
                send_websocket_notification(recipient.id, message)
            except Profile.DoesNotExist:
                continue

def send_websocket_notification(user_id, message):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'notifications_{user_id}',
        {
            'type': 'send_notification',
            'message': message
        }
    )
