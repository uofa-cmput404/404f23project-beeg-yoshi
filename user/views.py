from django.shortcuts import render
from .models import User,ServerAdmin, Comment, Post, Like, Friendship
from .serializers import UserSerializer, CommentSerializer, PostSerializer, LikeSerializer, FriendshipSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['GET'])
def author_list(request):  #tested
    if request.method=='GET':
        users=User.objects.filter(type='AUTHOR')
        serializer=UserSerializer(users,many=True)
        return Response(serializer.data)
@api_view(['POST'])
def create_author(request): #tested
    if request.method=='POST':
        serializer=UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET','PUT','DELETE'])
def single_author_method(request,pk): #tested
    try:
        user=User.objects.get(pk=pk, type='AUTHOR')
    except User.DoesNotExist:
        return Response({"message":{f"No author with id {pk} exist"}},status=status.HTTP_404_NOT_FOUND)
    if request.method=='GET':
        serializer=UserSerializer(user)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='PUT':
        serializer=UserSerializer(user,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method=='DELETE':
        user.delete()
        return Response({"message":{f" author with id {pk} is deleted"}},status=status.HTTP_200_OK)

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
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
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
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_comment_for_post(request,pk):
    if request.method=='GET':
        comments=Comment.objects.filter(post=pk)
        serializer=CommentSerializer(comments,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET', 'DELETE', 'PUT'])
def post_method(request,pk,postID):
    try:
        post=Post.objects.get(pk=postID)
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
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method=='DELETE':
        post.delete()
        return Response(status=status.HTTP_200_OK)
    
@api_view(['POST'])
def create_post(request,pk):
    if request.method=='POST':
        try:
            user=User.objects.get(pk=pk)
            request.data.update({"author":user.id})
            serializer=PostSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"message":{f"No author with id {request.data['author']} exist, create post fail"}},status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE', 'PUT'])
def single_like_method(request,pk):
    try:
        like=Like.objects.get(pk=pk)
    except Like.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method=='PUT':
        serializer=LikeSerializer(like,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
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
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
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
        followers={"type": "followers", "items": []}
        followers_list1 = Friendship.objects.filter(to_user=pk) # who direct follow the author
        followers_list2 = Friendship.objects.filter(from_user=pk, bidirectional=True) # who the author follows and the guy follows back
        for item in followers_list1:
            followers["items"].append({
                "id": item.from_user.id,
                "host": item.from_user.host,
                "displayName": item.from_user.displayName,
                "url": item.from_user.url,
                "host": item.from_user.host,
                "github": item.from_user.github,
                "profileImage": item.from_user.profileImage
            })
        for item in followers_list2:
            if item.to_user not in followers["items"]:
                followers["items"].append({
                    "id": item.to_user.id,
                    "host": item.to_user.host,
                    "displayName": item.to_user.displayName,
                    "url": item.to_user.url,
                    "host": item.to_user.host,
                    "github": item.to_user.github,
                    "profileImage": item.to_user.profileImage
                })
        if len(followers)<1:
            return Response({"message":{f"No one follow author with id {pk}"}},status=status.HTTP_200_OK)
        return Response(followers, status=status.HTTP_200_OK)

@api_view(['POST'])
def Be_friend(request):
    if request.method == 'POST':
        try:
            #check whether the to_user is already follow the from_user
            friendship = Friendship.objects.get(from_user=request.data['to_user'], to_user=request.data['from_user'])
            friendship.bidirectional = True
            friendship.save()
            return Response(status=status.HTTP_200_OK)
        except Friendship.DoesNotExist:
                try:
                    #check whether the from_user is already follow the to_user
                    friendship = Friendship.objects.get(from_user=request.data['from_user'], to_user=request.data['to_user'])
                    return Response({"message":"Friendship already exists"},status=status.HTTP_400_BAD_REQUEST)
                except Friendship.DoesNotExist:
                    serializer = FriendshipSerializer(data=request.data)
                    if serializer.is_valid():
                        serializer.save()
                        return Response(serializer.data, status=status.HTTP_201_CREATED)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET', 'DELETE', 'PUT'])
def single_friendship_method(request,pk,fk):
    try:
        friendship=Friendship.objects.get(pk=pk,fk=fk)
    except Friendship.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method=='GET':
        serializer=FriendshipSerializer(friendship)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='PUT':
        serializer=FriendshipSerializer(friendship,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method=='DELETE':
        friendship.delete()
        return Response(status=status.HTTP_200_OK)
