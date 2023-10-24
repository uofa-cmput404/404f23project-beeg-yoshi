from django.shortcuts import render
from .models import User,ServerAdmin, Comment, Post, Like, Friendship
from .serializers import UserSerializer, CommentSerializer, PostSerializer, LikeSerializer, FriendshipSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['GET'])
def author_list(request):
    if request.method=='GET':
        users=User.objects.all()
        serializer=UserSerializer(users,many=True)
        return Response(serializer.data)
@api_view(['POST'])
def create_author(request):
    if request.method=='POST':
        serializer=UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.error,status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET','PUT','DELETE'])
def single_author_method(request,pk):
    try:
        user=User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method=='GET':
        serializer=UserSerializer(user)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='PUT':
        serializer=UserSerializer(user,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.error,status=status.HTTP_400_BAD_REQUEST)
    elif request.method=='DELETE':
        user.delete()
        return Response(status=status.HTTP_200_OK)

@api_view(['GET', 'DELETE', 'PUT'])
def single_comment_method(request,pk):
    try:
        comment=Comment.objects.get(pk=pk)
    except Comment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method=='GET':
        serializer=CommentSerializer(comment)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='PUT':
        serializer=CommentSerializer(comment,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.error,status=status.HTTP_400_BAD_REQUEST)
    elif request.method=='DELETE':
        comment.delete()
        return Response(status=status.HTTP_200_OK)
@api_view(['POST'])
def create_comment(request):
    if request.method=='POST':
        serializer=CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.error,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_comment_for_post(request,pk):
    if request.method=='GET':
        comments=Comment.objects.filter(post=pk)
        serializer=CommentSerializer(comments,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET', 'DELETE', 'PUT'])
def single_post_method(request,pk):
    try:
        post=Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method=='GET':
        serializer=PostSerializer(post)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='PUT':
        serializer=PostSerializer(post,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.error,status=status.HTTP_400_BAD_REQUEST)
    elif request.method=='DELETE':
        post.delete()
        return Response(status=status.HTTP_200_OK)
    
@api_view(['POST'])
def create_post(request):
    if request.method=='POST':
        serializer=PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.error,status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE', 'PUT'])
def single_like_method(request,):
    try:
        like=Like.objects.get(pk=pk)
    except Like.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method=='PUT':
        serializer=LikeSerializer(like,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.error,status=status.HTTP_400_BAD_REQUEST)
    elif request.method=='DELETE':
        like.delete()
        return Response(status=status.HTTP_200_OK)
    
@api_view(['POST'])
def create_like(request):
    if request.method=='POST':
        serializer=LikeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.error,status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_like_for_post(request,pk):
    if request.method=='GET':
        likes=Like.objects.filter(post=pk)
        serializer=LikeSerializer(likes,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
def likes_of_single_author(request,pk):
    if request.method=='GET':
        likes=Like.objects.filter(author=pk)
        serializer=LikeSerializer(likes,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
def get_followers_of_single_author(request, pk):
    if request.method == 'GET':
        followers_list1 = Friendship.objects.filter(to_user=pk)
        followers_list2 = Friendship.objects.filter(from_user=pk, bidirectional=True)
        followers = list(set(list(followers_list1) + list(followers_list2)))
        serializer = FriendshipSerializer(followers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def Be_friend(request):
    if request.method == 'POST':
        serializer = FriendshipSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
