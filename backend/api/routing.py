from django.urls import path
from .consumers import *

# ws://127.0.0.1:8000/ws/notifications/
websocket_urlpatterns = [
    path("ws/notifications/", NotificationConsumer.as_asgi(), name="notification"),
]