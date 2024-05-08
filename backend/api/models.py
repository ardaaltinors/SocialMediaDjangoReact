from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.dispatch import receiver

def validate_image_size(image):
    if not image:
        return  # Eğer image `null` ise hiçbir şey yapma
    
    max_size_kb = 5120  # 5 MB
    if image.size > max_size_kb * 1024:
        raise ValidationError(f"Max image size is {max_size_kb} KB!")

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
    profile_picture = models.ImageField(upload_to='profile_pics/', validators=[validate_image_size],blank=True, null=True)
    cover_photo = models.ImageField(upload_to='cover_pics/', validators=[validate_image_size], blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    height = models.FloatField(blank=True, null=True)
    weight = models.FloatField(blank=True, null=True)
    goal = models.CharField(max_length=10, choices=GOAL_CHOICES, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile of {self.user.username}"

# Kullanıcı oluşturulduğunda otomatik profil eklemek için sinyal
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

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