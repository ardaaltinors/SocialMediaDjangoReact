from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxLengthValidator
from django.db.models.signals import post_save
from django.dispatch import receiver

def validate_image_size(image):
    if not image:
        return  # Eğer image `null` ise hiçbir şey yapma
    
    max_size_kb = 5120  # 5 MB
    if image.size > max_size_kb * 1024:
        raise ValidationError(f"Max image size is {max_size_kb} KB!")

# models.py
from django.db import models
from django.conf import settings

class Profile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    GOAL_CHOICES = [
        ('maintain', 'Maintain Weight'),
        ('gain', 'Gain Weight'),
        ('lose', 'Lose Weight'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    cover_photo = models.ImageField(upload_to='cover_pics/', blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    height = models.FloatField(blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    goal = models.CharField(max_length=10, choices=GOAL_CHOICES, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    followers = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)

    def __str__(self):
        return f"Profile of {self.user.username}"


class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/%Y/%m/%d', validators=[validate_image_size])
    caption = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)
    liked_by = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='posts_liked', blank=True)

    def __str__(self) -> str:
        return f"post id: {self.id} | by {self.user} on {self.created}"

    class Meta:
        ordering = ['-created']
        
        
class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField(validators=[MaxLengthValidator(500)])
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on post {self.post.id}"
    
    
class Notification(models.Model):
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='notifications', on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.recipient.username}'s notification: {self.message} |({'read' if self.is_read else 'unread'}) | {self.created_at}"