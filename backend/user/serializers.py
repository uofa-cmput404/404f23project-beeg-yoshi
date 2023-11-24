from .models import User,Like,Inbox
from django.contrib.contenttypes.models import ContentType
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["type","id","url","host","displayName","github","profileImage", "is_active", "biography"]




class LikeSerializer(serializers.ModelSerializer):
    content_type_name = serializers.SerializerMethodField()
    class Meta:
        model = Like
        fields = ['id', 'type', 'object_id', 'author', 'content_type_name', 'content_type']

    def get_content_type_name(self, obj):
        return obj.content_type.model
class InboxSerializer(serializers.ModelSerializer):
    class Meta:
        model=Inbox
        fields="__all__"