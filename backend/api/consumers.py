import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.group_name = f'user_{self.user.id}'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
        print("🔗WebSocket connection established")
        print("🔗Group name: ", self.group_name)
        print("🔗Channel name: ", self.channel_name)
        print("🔗User: ", self.user)


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        print("🔗WebSocket connection closed")

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'notification_message',
                'message': message
            }
        )
        print("🔗Message received: ", text_data)

    async def notification_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'message': '🔔 '+message,
            'group_name': self.group_name,
        }))
