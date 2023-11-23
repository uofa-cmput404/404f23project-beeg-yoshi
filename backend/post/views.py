from django.shortcuts import render
from .models import Post
from .serializers import PostSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from user.models import User
from friendship.models import Friendship
from django.db.models import Q
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@swagger_auto_schema(
    method='get',
    operation_description="Get all public posts and friends' private posts",
    responses={200: PostSerializer(many=True)}
)
@api_view(['GET'])
def get_public_and_friends_posts(request, pk):
    if request.method == 'GET':
        logged_in_user = pk
        friend_ids = Friendship.objects.filter(
            from_user=logged_in_user
        ).values_list('to_user_id', flat=True)
        posts = Post.objects.filter(
            Q(visibility=Post.Visibility.PUBLIC) | 
            Q(author__id__in=friend_ids, visibility=Post.Visibility.PRIVATE) |
            Q(author=logged_in_user)
        )

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
@swagger_auto_schema(
    method='get',
    operation_description="get single post of an author",
    responses={
        200: PostSerializer(),
        404: "Not Found"
        }
)
@swagger_auto_schema(
    method='delete',
    operation_description="delete single post of an author",
    responses={
        200: "OK",
        404: "Not Found"
        }
)
@swagger_auto_schema(
    method='put',
    operation_description="update single post of an author",
    responses={
        200: PostSerializer(),
        400: "Bad Request",
        404: "Not Found"
        }
)

@api_view(['GET', 'DELETE', 'PUT'])
def post_method(request,pk,postID):
    user=User.objects.get(pk=pk)
    try:
        post=Post.objects.get(pk=postID, author=pk)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method=='GET':
        serializer=PostSerializer(post)
        response=serializer.data
        response["author"]={
            "id":user.id,
            "host":user.host,
            "displayName":user.displayName,
            "url":user.url,
            "github":user.github,
            "profileImage":user.profileImage
        } 
        return Response(response,status=status.HTTP_200_OK)
    elif request.method=='PUT':
        serializer=PostSerializer(post,data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method=='DELETE':
        post.delete()
        return Response({"message":f"post with id {postID} of user with id {pk} is deleted"},status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='post',
    operation_description="create post of an author",
    responses={
        201: PostSerializer(),
        400: "Bad Request",
        404: "Not Found"
        }
)
@swagger_auto_schema(
    method='get',
    operation_description="get all posts of an author",
    responses={
        200: PostSerializer(many=True),
        404: "Not Found"
        }
) 
@api_view(['POST', 'GET'])
def create_post(request,pk):
    if request.method=='POST':
        try:
            user=User.objects.get(pk=pk)
            request.data.update({"author":user.id})
            serializer=PostSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                response=serializer.data
                response["author"]={
                    "id":user.id,
                    "host":user.host,
                    "displayName":user.displayName,
                    "url":user.url,
                    "github":user.github,
                    "profileImage":user.profileImage
                }
                return Response(response,status=status.HTTP_201_CREATED)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"message":{f"No author with id {request.data['author']} exist, create post fail"}},status=status.HTTP_404_NOT_FOUND)
    elif request.method=='GET':
        try:
            user=User.objects.get(pk=pk)
            posts=Post.objects.filter(author=user.id)
            serializer=PostSerializer(posts,many=True)
            return Response(serializer.data,status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message":{f"No author with id {pk} exist, get posts fail"}},status=status.HTTP_404_NOT_FOUND)