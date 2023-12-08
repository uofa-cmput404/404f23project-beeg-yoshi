from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Comment,remoteComment
from .serializers import CommentSerializer, remoteCommentSerializer
from user.models import User
from post.models import Post
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

@swagger_auto_schema(
    method='get',
    operation_description="get all comments of a post",
    responses={200: CommentSerializer(many=True)}
)
@swagger_auto_schema(
    method='post',
    operation_description="create a comment on a post",
    responses={
        201: CommentSerializer(),
        400: "Bad Request",
        }
)
@api_view(['GET', 'POST'])
def comment_on_post(request,pk,postID):
    if request.method=='GET':
        comments=Comment.objects.filter(post=postID)
        serializer=CommentSerializer(comments,many=True)
        remote_comments=remoteComment.objects.filter(post=postID)
        remote_serializer=remoteCommentSerializer(remote_comments,many=True)
        for comment in serializer.data:
            comment["author"]={
                "id":comment["author"],
                "host":User.objects.get(pk=comment["author"]).host,
                "displayName":User.objects.get(pk=comment["author"]).displayName,
                "url":User.objects.get(pk=comment["author"]).url,
                "github":User.objects.get(pk=comment["author"]).github,
                "profileImage":User.objects.get(pk=comment["author"]).profileImage
            }
        print(remote_serializer.data)
        print(serializer.data)
        response=serializer.data+remote_serializer.data
        return Response(response,status=status.HTTP_200_OK)
    elif request.method=='POST':
        serializer=CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            post=Post.objects.get(pk=postID)
            post.count+=1
            post.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
def remote_comment_on_post(request,postID):
    if request.method=='GET':
        comments=remoteComment.objects.filter(post=postID)
        serializer=remoteCommentSerializer(comments,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='POST':
        post_obj=Post.objects.get(pk=postID)
        request.data["post"]=postID
        serializer=remoteCommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            post_obj.count+=1
            post_obj.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
