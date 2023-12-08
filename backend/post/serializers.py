from rest_framework import serializers
from .models import Post,Image

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model=Post
        # fields=["type","title","id","author","source","origin","description","contentType","content"]
        fields="__all__"
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model=Image
        fields="__all__"