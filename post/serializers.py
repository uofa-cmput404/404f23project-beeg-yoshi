from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model=Post
        # fields=["type","title","id","author","source","origin","description","contentType","content"]
        fields="__all__"