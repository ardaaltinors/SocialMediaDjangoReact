# consumers.py
from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync

class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        user = self.scope["user"]
        self.user_group_name = f"user_{user.id}"
        
        # Kullanıcıyı grup'a ekleme
        async_to_sync(self.channel_layer.group_add)(
            self.user_group_name,
            self.channel_name
        )

    def disconnect(self, close_code):
        # Kullanıcıyı grup'tan çıkarma
        async_to_sync(self.channel_layer.group_discard)(
            self.user_group_name,
            self.channel_name
        )

    def notify(self, event):
        message = event["message"]
        self.send(text_data=json.dumps({
            "message": message
        }))
