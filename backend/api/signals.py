from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from .models import Comment, Notification, Post, Profile

@receiver(post_save, sender=Comment)
def send_notification_on_comment(sender, instance, created, **kwargs):
    if created:
        post = instance.post
        recipient = post.user
        comment_preview = instance.text[:24] if len(instance.text) > 24 else instance.text
        message = f"💬{instance.user.username} commented on your post: '{comment_preview}...'"
        Notification.objects.create(recipient=recipient, message=message)


@receiver(m2m_changed, sender=Post.liked_by.through)
def send_notification_on_like(sender, instance, action, model, pk_set, **kwargs):
    if action == "post_add":
        for user_id in pk_set:
            if instance.user.id != user_id:  # Kullanıcı kendi gönderisini beğenmediyse
                message = f"♥️{instance.user.username} liked your post."
                Notification.objects.create(recipient=instance.user, message=message)
                
                
@receiver(m2m_changed, sender=Profile.followers.through)
def send_notification_on_new_follower(sender, instance, action, model, pk_set, **kwargs):
    if action == "post_add":  # Yeni bir takipçi eklendiğinde
        for user_id in pk_set:
            follower = instance.user.username
            message = f"{follower} has started following you."
            Notification.objects.create(recipient=instance.user, message=message)