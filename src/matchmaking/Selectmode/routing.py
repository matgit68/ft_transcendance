from django.urls import re_path, path

from . import consumer, consumer_fake

websockets_urlpatterns = [
    re_path(r"ws/soloq/(?P<room_name>\w+)/$", consumer.GamesConsumer.as_asgi()),
    re_path(r'ws/game/(?P<game_id>\d+)/$', consumer_fake.FakeConsumer.as_asgi()),
]