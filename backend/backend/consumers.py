import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from urllib.parse import parse_qs
import json
from rest_framework_simplejwt.tokens import AccessToken
from api.models import Notification

User = get_user_model()
logger = logging.getLogger(__name__)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            # Extract query parameters
            query_params = parse_qs(self.scope['query_string'].decode())

            # Get access_token from query parameters
            access_token = query_params.get('access_token', [''])[0]

            # Authenticate user
            user = await self.authenticate_user(access_token)
            if user:
                self.user = user
                self.room_group_name = f'notifications_{self.user.id}'
            else:
                logger.error("Failed to authenticate user")
                await self.close()
                return

            # Join notifications group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            await self.accept()
            unread_notifications = await self.get_unread_notifications(self.user.id)
            await self.send_notifications(unread_notifications)
            logger.info(f"WebSocket connection established for user {self.user.username} with unread notifications sent")
        except Exception as e:
            logger.error(f"Error establishing WebSocket connection: {e}")
            await self.close()

    async def authenticate_user(self, access_token):
        try:
            # Decode the access token and get the user
            token = AccessToken(access_token)
            user_id = token['user_id']
            user = await database_sync_to_async(User.objects.get)(id=user_id)
            return user
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            return None

    async def disconnect(self, close_code):
        # Leave notifications group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        if hasattr(self, 'user'):
            logger.info(f"WebSocket connection closed for user {self.user.username}")
        else:
            logger.info("WebSocket connection closed :(")

    async def receive(self, text_data):
        # Notifications consumer does not receive data from WebSocket
        pass

    @database_sync_to_async
    def get_unread_notifications(self, user_id):
        notifications = Notification.objects.filter(recipient_id=user_id, is_read=False).order_by('-created_at')
        return [{
            'id': notification.id,
            'message': notification.message,
            'created_at': notification.created_at.strftime("%Y-%m-%d %H:%M:%S")
        } for notification in notifications]

    async def send_notifications(self, notifications):
        for notification in notifications:
            await self.send(text_data=json.dumps({
                'type': 'unread_notification',
                'message': notification['message'],
                'created_at': notification['created_at']
            }))

    async def send_notification(self, event):
        # Send notification to WebSocket
        try:
            await self.send(text_data=json.dumps({
                'type': 'new_notification',
                'message': event['message']
            }))
        except Exception as e:
            logger.error(f"Error sending notification to WebSocket: {e}")
