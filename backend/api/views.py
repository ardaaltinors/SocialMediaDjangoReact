from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import UserSerializer, PostSerializer
from .models import Post

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)