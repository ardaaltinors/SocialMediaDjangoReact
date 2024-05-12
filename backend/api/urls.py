from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, EditProfileViewSet, UserProfileView, CommentListCreateDeleteView, ToggleLikeView, ToggleFollowView, NotificationListView, SearchAPIView

router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'profiles', EditProfileViewSet, basename='edit-profile')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/<str:username>/', UserProfileView.as_view(), name='user-profile'),
    path('comments/post/<int:post_id>/', CommentListCreateDeleteView.as_view(), name='comment-list-create-delete'),
    path('posts/<int:post_id>/toggle-like/', ToggleLikeView.as_view(), name='toggle-like'),
    path('users/<int:user_id>/toggle-follow/', ToggleFollowView.as_view(), name='toggle-follow'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('search/', SearchAPIView.as_view(), name='search')
]
