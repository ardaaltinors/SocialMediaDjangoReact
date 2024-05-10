from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission, SAFE_METHODS

from .serializers import *
from .models import *

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
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def delete(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.user == request.user:
            return self.destroy(request, *args, **kwargs)
        return Response({'detail': 'You do not have permission to delete this comment.'}, status=403)
            
            
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