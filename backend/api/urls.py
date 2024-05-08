from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, EditProfileViewSet, UserProfileView

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'profiles', EditProfileViewSet, basename='edit-profile')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/<str:username>/', UserProfileView.as_view(), name='user-profile')
]
