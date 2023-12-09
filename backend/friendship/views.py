from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Friendship, FriendRequest,remoteFriendRequest,remoteFriendship
from .serializers import FriendshipSerializer, FriendRequestSerializer,remoteFriendRequestSerializer,remoteFriendshipSerializer
from user.models import User,Inbox, UserToken
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
        token = request.headers.get('Authorization')
        the_user = str(UserToken.objects.get(user=pk).token)
        if token != the_user:
            return Response({"message": "You are not authorized to view this page"}, status=status.HTTP_401_UNAUTHORIZED)
        friendship=Friendship.objects.filter(from_user=fk,to_user=pk)
        if friendship.exists():
            return Response({"message":{f"Friendship already exists "}},status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer=FriendshipSerializer(data={"from_user":fk,"to_user":pk})
            if serializer.is_valid():
                serializer.save()
                inbox_object=Inbox.objects.get(author=pk)
                inbox_object.items=request.data
                inbox_object.save()
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
            return Response(followers, status=status.HTTP_200_OK)
        return Response(followers, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_description="Get friend requests of an author with another author",
    responses={
        200: FriendshipSerializer(many=True),
        }
)
@swagger_auto_schema(
    method='delete',
    operation_description="Delete a friend request of an author with another author",
    responses={
        200: "OK",
        404: "Not Found"
        }
)
@swagger_auto_schema(
    method='post',
    operation_description="Send a friend request to an author",
    responses={
        201: FriendshipSerializer(),
        400: "Bad Request",
        404: "Not Found"
        }
)
@swagger_auto_schema(
    method='put',
    operation_description="Accept a friend request of an author with another author",
    responses={
        200: "OK",
        400: "Bad Request",
        404: "Not Found"
    }
)
@api_view(['GET', 'DELETE', 'PUT', 'POST'])
def friend_request_methods(request,pk,fk):
    if request.method=='GET':
        try:
            friend_request=FriendRequest.objects.get(from_user=pk,to_user=fk)
        except FriendRequest.DoesNotExist:
            return Response({"message":{f"Friend request does not exist "}},status=status.HTTP_404_NOT_FOUND)
        serializer=FriendRequestSerializer(friend_request)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='DELETE':
        try:
            friend_request=FriendRequest.objects.get(from_user=pk,to_user=fk)
        except FriendRequest.DoesNotExist:
            return Response({"message":{f"Friend request does not exist "}},status=status.HTTP_404_NOT_FOUND)
        friend_request.delete()
        return Response({"message":"friend request deleted"},status=status.HTTP_200_OK)
    elif request.method=='POST':
        friend_request=FriendRequest.objects.filter(from_user=pk,to_user=fk)
        if friend_request.exists():
            return Response({"message":{f"Friend request already exists "}},status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer=FriendRequestSerializer(data={"from_user":pk,"to_user":fk})
            if serializer.is_valid():
                serializer.save()
                inbox_object=Inbox.objects.get(author=fk)
                message=serializer.data
                message["from_user_name"]=User.objects.get(id=pk).displayName
                message["to_user_name"]=User.objects.get(id=fk).displayName
                message["summary"]=f"{message['from_user_name']} sent you a friend request"
                inbox_object.items["friendrequests"].append(message)
                inbox_object.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)
    elif request.method=='PUT':
        try:
            friend_request=FriendRequest.objects.get(from_user=pk,to_user=fk)
        except FriendRequest.DoesNotExist:
            return Response({"message":{f"Friend request does not exist "}},status=status.HTTP_404_NOT_FOUND)
        if friend_request.status=='pending':
            friend_request.status='accepted'
            friend_request.save()
            return Response({"message":"friend request status changed"},status=status.HTTP_200_OK)
        else:
            return Response({"message":{f"Friend request is not pending"}},status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method='get',
    operation_description="Get all pending friend requests of an author",
    responses={
        200: FriendshipSerializer(many=True),
        }
)
@api_view(['GET'])
def get_pending_friend_request(request,pk):
    if request.method == 'GET':
        pending_friend_request={"type": "friendrequests", "items": []}
        pending_friend_request_list1 = FriendRequest.objects.filter(from_user=pk,status='pending')
        for item in pending_friend_request_list1:
            pending_friend_request["items"].append({
                "id": item.to_user.id,
                "host": item.to_user.host,
                "displayName": item.to_user.displayName,
                "url": item.to_user.url,
                "host": item.to_user.host,
                "github": item.to_user.github,
                "profileImage": item.to_user.profileImage
            })
        return Response(pending_friend_request, status=status.HTTP_200_OK)
@api_view(['GET', 'DELETE', 'PUT', 'POST'])
def single_remote_friendship_methods(request,pk,fk):
    if request.method=='GET':
        try:
            friendship=remoteFriendship.objects.get(from_user=fk,to_user=pk)
        except remoteFriendship.DoesNotExist:
            return Response({"message":{f"Friendship does not exist "}},status=status.HTTP_404_NOT_FOUND)
        serializer=remoteFriendshipSerializer(friendship)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='DELETE':
        try:
            friendship=remoteFriendship.objects.get(from_user=fk,to_user=pk)
        except remoteFriendship.DoesNotExist:
            return Response({"message":{f"Friendship does not exist "}},status=status.HTTP_404_NOT_FOUND)
        friendship.delete()
        return Response({"message":f"author with id {fk} unfollowed author with id {pk}"},status=status.HTTP_200_OK)
    elif request.method=='PUT':
        friendship=remoteFriendship.objects.filter(from_user=fk,to_user=pk)
        if friendship.exists():
            return Response({"message":{f"Friendship already exists "}},status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer=remoteFriendshipSerializer(data={"from_user":fk,"to_user":pk})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)
    elif request.method=='POST':
        friendship=remoteFriendship.objects.filter(from_user=fk,to_user=pk)
        if friendship.exists():
            return Response({"message":{f"Friendship already exists "}},status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer=remoteFriendshipSerializer(data={"from_user":fk,"to_user":pk})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)
@api_view(['GET'])
def get_remote_followers_of_single_author(request, pk):
    if request.method == 'GET':
        followers={"type": "followers", "items": []}
        followers_list1 = remoteFriendship.objects.filter(to_user=pk)
        for item in followers_list1:
            followers["items"].append({
                "id": item.from_user,
                "server":item.server,
            })
        if len(followers['items'])<1:
            return Response(followers, status=status.HTTP_200_OK)
        return Response(followers, status=status.HTTP_200_OK)
@api_view(['GET', 'DELETE', 'PUT', 'POST'])
def remote_friend_request_methods(request,pk,fk):
    if request.method=='GET':
        try:
            friend_request=remoteFriendRequest.objects.get(from_user=pk,to_user=fk)
        except remoteFriendRequest.DoesNotExist:
            return Response({"message":{f"Friend request does not exist "}},status=status.HTTP_404_NOT_FOUND)
        serializer=remoteFriendRequestSerializer(friend_request)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='DELETE':
        try:
            friend_request=remoteFriendRequest.objects.get(from_user=pk,to_user=fk)
        except remoteFriendRequest.DoesNotExist:
            return Response({"message":{f"Friend request does not exist "}},status=status.HTTP_404_NOT_FOUND)
        friend_request.delete()
        user_ids=list(User.objects.values_list('id', flat=True))
        user_ids_str = [str(user_id) for user_id in user_ids]
        if fk in user_ids_str:
            inbox_object=Inbox.objects.get(author=fk)
            inbox_object.items["friendrequests"]=[]
            inbox_object.save()
        if remoteFriendship.objects.filter(from_user=pk,to_user=fk).exists():
            remote_friendship=remoteFriendship.objects.get(from_user=pk,to_user=fk)
            remote_friendship.delete()
        return Response({"message":"friend request deleted"},status=status.HTTP_200_OK)
    elif request.method=='POST':
        friend_request=remoteFriendRequest.objects.filter(from_user=pk,to_user=fk)
        if friend_request.exists():
            return Response({"message":{f"Friend request already exists "}},status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer=remoteFriendRequestSerializer(data={"from_user":pk,"to_user":fk, "server": request.data["server"]})
            if serializer.is_valid():
                serializer.save()
                user_ids=list(User.objects.values_list('id', flat=True))
                user_ids_str = [str(user_id) for user_id in user_ids]
                if fk in user_ids_str:
                    inbox_object=Inbox.objects.get(author=fk)
                    message=serializer.data
                    message["from_user_name"]=request.data["displayName"]
                    message["to_user_name"]=User.objects.get(id=fk).displayName
                    message["summary"]=f"{message['from_user_name']} sent you a friend request"
                    message["server"]=request.data["server"]
                    inbox_object.items["friendrequests"].append(message)
                    inbox_object.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)
    elif request.method=='PUT':
        try:
            friend_request=remoteFriendRequest.objects.get(from_user=pk,to_user=fk)
        except remoteFriendRequest.DoesNotExist:
            return Response({"message":{f"Friend request does not exist "}},status=status.HTTP_404_NOT_FOUND)
        if friend_request.status=='pending':
            friend_request.status='accepted'
            friend_request.save()
            remote_friendship=remoteFriendship.objects.create(from_user=pk,to_user=fk, server=request.data["server"])
            remote_friendship.save()
            user_ids=list(User.objects.values_list('id', flat=True))
            user_ids_str = [str(user_id) for user_id in user_ids]
            if fk in user_ids_str:
                inbox_object=Inbox.objects.get(author=fk)
                inbox_object.items["friendrequests"]=request.data["friendrequests"]
                inbox_object.save()
            return Response({"message":"friend request status changed"},status=status.HTTP_200_OK)
        else:
            return Response({"message":{f"Friend request is not pending"}},status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def get_remote_pending_friend_request(request,pk):
    if request.method == 'GET':
        pending_friend_request={"type": "friendrequests", "items": []}
        pending_friend_request_list1 = remoteFriendRequest.objects.filter(from_user=pk,status='pending')
        for item in pending_friend_request_list1:
            pending_friend_request["items"].append({
                "id": item.to_user,
                "server":item.server,
            })
        return Response(pending_friend_request, status=status.HTTP_200_OK)