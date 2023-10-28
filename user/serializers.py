from .models import User,Friendship,Comment,Post,Like,Inbox
from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["type","id","email","password","url","host","displayName","github","profileImage"]

class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model=Friendship
        fields=["from_user","to_user"]

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Comment
        fields=["id","author","post","comment","contentType","published"]

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model=Post
        # fields=["type","title","id","author","source","origin","description","contentType","content"]
        fields="__all__"

class LikeSerializer(serializers.ModelSerializer):
    content_type_name = serializers.SerializerMethodField()
    class Meta:
        model = Like
        fields = ['id', 'type', 'object_id', 'author', 'content_type_name']

    def get_content_type_name(self, obj):
        return obj.content_type.model
class InboxSerializer(serializers.ModelSerializer):
    class Meta:
        model=Inbox
        fields="__all__"