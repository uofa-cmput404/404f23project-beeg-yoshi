from .models import User,Friendship,Comment,Post,Like

from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["type","id","url","host","displayName","github","profileImage"]

class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model=Friendship
        fields=["from_user","to_user","bidirectional"]

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Comment
        fields=["id","author","post","comment","contentType","published"]

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model=Post
        fields=["title","id","author","source","origin","description","contentType","content"]

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Like
        fields=["id","author","post"]