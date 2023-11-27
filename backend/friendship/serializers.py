from rest_framework import serializers
from .models import Friendship, FriendRequest,remoteFriendRequest,remoteFriendship
class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model=Friendship
        fields=["from_user","to_user"]


class FriendRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model=FriendRequest
        fields=["from_user","to_user","status"]

class remoteFriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model=remoteFriendship
        fields=["from_user","to_user", "server"]

class remoteFriendRequestSerializer(serializers.ModelSerializer):
        class Meta:
            model=remoteFriendRequest
            fields=["from_user","to_user","status", "server"]