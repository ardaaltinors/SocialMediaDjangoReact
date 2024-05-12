from django.shortcuts import render, get_object_or_404
from django.http import Http404
from django.contrib.auth.models import User
from rest_framework import generics, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission, SAFE_METHODS

from .serializers import *
from .models import *

def create_notification(recipient, message):
    Notification.objects.create(recipient=recipient, message=message)

# Register API
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        user = serializer.save()
        Profile.objects.create(user=user)
    
    
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user)
        else:
            print(serializer.errors)
            
            
class IsOwnerOrReadOnly(BasePermission):
    """
    Yalnızca yorumu oluşturan kullanıcıya kendi yorumunu silme izni verir.
    """
    def has_object_permission(self, request, view, obj):
        # Okuma izinleri (GET) herkes için açıktır
        if request.method in SAFE_METHODS:
            return True
        # Yalnızca yorumu oluşturan kullanıcıya silme izni verir
        return obj.user == request.user


class CommentListCreateDeleteView(generics.ListCreateAPIView, generics.DestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    
    def get_queryset(self):
        post_id = self.kwargs.get('post_id')
        return Comment.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        post = Post.objects.get(id=post_id)
        serializer.save(user=self.request.user, post=post)

    def delete(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.user == request.user:
            return self.destroy(request, *args, **kwargs)
        return Response({'detail': 'You do not have permission to delete this comment.'}, status=403)
    
    
class ToggleLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        user = request.user

        if user in post.liked_by.all():
            post.liked_by.remove(user)
            action = "like removed"
        else:
            post.liked_by.add(user)
            action = "like added"

        # Return the number of likes
        likes_count = post.liked_by.count()
        return Response({"status": action, "likes_count": likes_count}, status=status.HTTP_200_OK)

    def get(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        likes_count = post.liked_by.count()
        return Response({"likes_count": likes_count})
    
    
class ToggleFollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        target_user = get_object_or_404(User, pk=user_id)
        user_profile = request.user.profile

        if target_user.profile in user_profile.following.all():
            user_profile.following.remove(target_user.profile)
            return Response({'status': 'unfollowed'}, status=status.HTTP_200_OK)
        else:
            user_profile.following.add(target_user.profile)
            return Response({'status': 'followed'}, status=status.HTTP_200_OK)
            
            
class EditProfileViewSet(viewsets.ModelViewSet):
    serializer_class = EditProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = 'username'
    permission_classes = [AllowAny]
    
    
class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user, is_read=False)