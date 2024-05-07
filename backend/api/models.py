from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

def validate_image_size(image):
    max_size_kb = 5120  # 5 MB
    if image.size > max_size_kb * 1024:
        raise ValidationError(f"Max image size is {max_size_kb} KB!")

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