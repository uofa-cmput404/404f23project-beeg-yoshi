from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Friendship, FriendRequest
from .serializers import FriendshipSerializer, FriendRequestSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

@swagger_auto_schema(
    method='get',
    operation_description="Get a friend of an author",
    responses={
        200: FriendshipSerializer(),
        404: "Not Found"
        }
)
@swagger_auto_schema(
    method='delete',
    operation_description="Delete a friend of an author",
    responses={
        200: "OK",
        404: "Not Found"
        }
)
@swagger_auto_schema(
    method='put',
    operation_description="Add a friend of an author",
    responses={
        201: FriendshipSerializer(),
        400: "Bad Request",
        404: "Not Found"
        }
)
@api_view(['GET', 'DELETE', 'PUT'])
def single_friendship_method(request,pk,fk):
    if request.method=='GET':
        try:
            friendship=Friendship.objects.get(from_user=fk,to_user=pk)
        except Friendship.DoesNotExist:
            return Response({"message":{f"Friendship does not exist "}},status=status.HTTP_404_NOT_FOUND)
        serializer=FriendshipSerializer(friendship)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='DELETE':
        try:
            friendship=Friendship.objects.get(from_user=fk,to_user=pk)
        except Friendship.DoesNotExist:
            return Response({"message":{f"Friendship does not exist "}},status=status.HTTP_404_NOT_FOUND)
        friendship.delete()
        return Response({"message":f"author with id {fk} unfollowed author with id {pk}"},status=status.HTTP_200_OK)
    elif request.method=='PUT':
        friendship=Friendship.objects.filter(from_user=fk,to_user=pk)
        if friendship.exists():
            return Response({"message":{f"Friendship already exists "}},status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer=FriendshipSerializer(data={"from_user":fk,"to_user":pk})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)

@swagger_auto_schema(
    method='get',
    operation_description="Get all followers of an author",
    responses={
        200: FriendshipSerializer(many=True),
        }
)
@api_view(['GET'])
def get_followers_of_single_author(request, pk):
    if request.method == 'GET':
        followers={"type": "followers", "items": []}
        followers_list1 = Friendship.objects.filter(to_user=pk)
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
        if len(followers['items'])<1:
            return Response({"message":{f"No one follow author with id {pk}"}},status=status.HTTP_200_OK)
        return Response(followers, status=status.HTTP_200_OK)

@api_view(['GET', 'DELETE', 'PUT', 'POST'])
def friend_request_methods(request,pk,fk):
    if request.method=='GET':
        try:
            friend_request=FriendRequest.objects.get(from_user=fk,to_user=pk)
        except FriendRequest.DoesNotExist:
            return Response({"message":{f"Friend request does not exist "}},status=status.HTTP_404_NOT_FOUND)
        serializer=FriendRequestSerializer(friend_request)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='DELETE':
        try:
            friend_request=FriendRequest.objects.get(from_user=fk,to_user=pk)
        except FriendRequest.DoesNotExist:
            return Response({"message":{f"Friend request does not exist "}},status=status.HTTP_404_NOT_FOUND)
        friend_request.delete()
        return Response({"message":f"author with id {fk} unfollowed author with id {pk}"},status=status.HTTP_200_OK)
    elif request.method=='POST':
        friend_request=FriendRequest.objects.filter(from_user=fk,to_user=pk)
        if friend_request.exists():
            return Response({"message":{f"Friend request already exists "}},status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer=FriendRequestSerializer(data={"from_user":fk,"to_user":pk})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)
    elif request.method=='PUT':
        try:
            friend_request=FriendRequest.objects.get(from_user=pk,to_user=fk)
        except FriendRequest.DoesNotExist:
            return Response({"message":{f"Friend request does not exist "}},status=status.HTTP_404_NOT_FOUND)
        if friend_request.status=='pending':
            friend_request.status='accepted'
            friend_request.save()
            return Response({"message":f"author with id {pk} accepted friend request from author with id {fk}"},status=status.HTTP_200_OK)
        else:
            return Response({"message":{f"Friend request is not pending "}},status=status.HTTP_400_BAD_REQUEST)