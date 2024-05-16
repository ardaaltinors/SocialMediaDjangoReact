from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Post, Profile, Comment, Notification

class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(source='profile.profile_picture', read_only=True)
    
    class Meta:
        model = User
        fields = ["id", "username", "profile_picture"]
        extra_kwargs = {"password": {"write_only": True, "required": True}}
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    
class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'user', 'image', 'caption', 'created', 'liked_by']
        read_only_fields = ['id', 'created', 'liked_by']
        
        
class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'text', 'created']
        read_only_fields = ['id', 'created', 'user', 'post']
       
        
class EditProfileSerializer(serializers.ModelSerializer):
    followers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    following = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'bio', 'profile_picture', 'cover_photo',
            'gender', 'height', 'weight', 'goal',
            'date_of_birth', 'created', 'followers', 'following'
        ]
        read_only_fields = ['id','user', 'created', 'followers', 'following']
        
        
class UserProfileSerializer(serializers.ModelSerializer):
    posts = serializers.SerializerMethodField()
    bio = serializers.CharField(source='profile.bio')
    profile_picture = serializers.ImageField(source='profile.profile_picture')
    cover_photo = serializers.ImageField(source='profile.cover_photo')
    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()
    current_user_id = serializers.SerializerMethodField()  # Mevcut kullanıcı ID'si için alan ekleme
    
    class Meta:
        model = User
        fields = ['id' ,'username', 'bio', 'profile_picture', 'cover_photo', 'followers', 'following', 'posts', 'current_user_id']
    
    def get_posts(self, obj):
        posts = Post.objects.filter(user=obj).order_by('-created')
        return [{'id': post.id, 'caption': post.caption, 'image': post.image.url, 'created': post.created} for post in posts]

    def get_followers(self, obj):
        profile = Profile.objects.get(user=obj)
        return [follower.user.username for follower in profile.followers.all()]

    def get_following(self, obj):
        profile = Profile.objects.get(user=obj)
        return [following.user.username for following in profile.following.all()]
    
    def get_current_user_id(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return request.user.id
        return None


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'recipient', "message", 'created_at', 'is_read']
