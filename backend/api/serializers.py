from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Post, Profile

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
        read_only_fields = ['id', 'created']
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['user', 'bio', 'profile_picture', 'cover_photo', 'gender', 'height', 'weight', 'goal', 'date_of_birth', 'created']
        read_only_fields = ['user', 'created']