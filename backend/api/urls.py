from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, ProfileViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'profiles', ProfileViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
]
