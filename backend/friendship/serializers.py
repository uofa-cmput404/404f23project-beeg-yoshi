from rest_framework import serializers
from .models import Friendship, FriendRequest
class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model=Friendship
        fields=["from_user","to_user"]


class FriendRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model=FriendRequest
        fields=["from_user","to_user","status"]