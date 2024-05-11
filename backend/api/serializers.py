from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Post, Profile, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
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
    username = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'username', 'text', 'created']
        read_only_fields = ['id', 'created', 'user', 'username', 'post']

    def get_username(self, obj):
        return obj.user.username
       
        
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
    
    class Meta:
        model = User
        fields = ['username', 'bio', 'profile_picture', 'cover_photo', 'followers', 'following', 'posts']
    
    def get_posts(self, obj):
        posts = Post.objects.filter(user=obj).order_by('-created')
        return [{'id': post.id, 'caption': post.caption, 'image': post.image.url, 'created': post.created} for post in posts]

    def get_followers(self, obj):
        profile = Profile.objects.get(user=obj)
        return [follower.user.username for follower in profile.followers.all()]

    def get_following(self, obj):
        profile = Profile.objects.get(user=obj)
        return [following.user.username for following in profile.following.all()]
