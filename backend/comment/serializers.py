from rest_framework import serializers
from .models import Comment,remoteComment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Comment
        fields=["id","author","post","comment","contentType","published"]
        
class remoteCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model=remoteComment
        fields="__all__"