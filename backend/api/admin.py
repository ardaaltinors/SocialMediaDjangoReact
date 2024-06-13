from django.contrib import admin
from .models import Post, Comment, Notification, Profile

class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'caption', 'created')
    list_filter = ('created', 'user')
    search_fields = ('caption', 'user__username')
    ordering = ('-created',)
    fields = ('user', 'image', 'video', 'caption', 'created', 'liked_by')
    readonly_fields = ('liked_by',)

class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'user', 'text', 'created')
    list_filter = ('created', 'user', 'post')
    search_fields = ('text', 'user__username', 'post__caption')
    ordering = ('-created',)
    fields = ('post', 'user', 'text', 'created')
    readonly_fields = ('created',)

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'recipient', 'message', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at', 'recipient')
    search_fields = ('message', 'recipient__username')
    ordering = ('-created_at',)
    fields = ('recipient', 'message', 'is_read', 'created_at')
    readonly_fields = ('created_at',)

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender', 'height', 'weight', 'goal', 'created')
    list_filter = ('gender', 'goal', 'created')
    search_fields = ('user__username', 'bio')
    ordering = ('-created',)
    fields = ('user', 'bio', 'profile_picture', 'cover_photo', 'gender', 'height', 'weight', 'goal', 'date_of_birth', 'followers', 'created')
    readonly_fields = ('created', 'followers')

admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Notification, NotificationAdmin)
admin.site.register(Profile, ProfileAdmin)
