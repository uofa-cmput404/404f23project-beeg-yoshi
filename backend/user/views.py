from django.shortcuts import render
from .models import User,ServerAdmin, Like,Inbox
from friendship.models import Friendship, FriendRequest
from .serializers import UserSerializer,LikeSerializer,InboxSerializer
from friendship.serializers import FriendshipSerializer, FriendRequestSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Q
from friendship.models import Friendship
from post.models import Post
from post.serializers import PostSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
Author methods
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
@swagger_auto_schema(
    method='post',
    operation_description='Login with credentials',
    responses={
        200: openapi.Response(
            description='Login to the system',
            schema=UserSerializer()
        ),
        404: 'Not found',
    },
)
@api_view(['POST'])
def login(request):
    if request.method=='POST':
        try:
            user=User.objects.get(email=request.data['email'],password=request.data['password'])
        except User.DoesNotExist:
            return Response({"message":f"User does not exist or password is wrong"},status=status.HTTP_404_NOT_FOUND)
        serializer=UserSerializer(user)
        return Response(serializer.data,status=status.HTTP_200_OK)
@swagger_auto_schema(
    method='get',
    operation_description='Get all authors',
    responses={
        200: openapi.Response(
            description='Get all authors',
            schema=UserSerializer()
        ),
    },)
@api_view(['GET'])
def author_list(request):  
    if request.method=='GET':
        users=User.objects.filter(type='AUTHOR')
        serializer=UserSerializer(users,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
@swagger_auto_schema(
    method='get',
    operation_description='Get all friends of an author',
    responses={
        200: openapi.Response(
            description='Get all friends of an author',
            schema=UserSerializer(many=True)
        ),
    },)    

@api_view(['GET'])
def get_all_friendship_of_single_author(request, pk):
  if request.method == 'GET':
        friend_ids = Friendship.objects.filter(from_user_id=pk).values_list('to_user_id', flat=True)
        friends = User.objects.filter(id__in=friend_ids)
        serializer = UserSerializer(friends, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
@swagger_auto_schema(
        method='get',
        operation_description='Get all strangers of an author',
        responses={
            200: openapi.Response(
                description='Get all strangers of an author',
                schema=UserSerializer(many=True)
            ),
        },
)
@api_view(['GET'])
def get_stranger_of_single_author(request,pk):
    if request.method == 'GET':
        friend_ids = Friendship.objects.filter(from_user_id=pk).values_list('to_user_id', flat=True)
        non_friends = User.objects.filter(type='AUTHOR').exclude(id__in=friend_ids).exclude(id=pk).exclude(id__in=FriendRequest.objects.filter(from_user_id=pk).values_list('to_user_id', flat=True))
        serializer = UserSerializer(non_friends, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
@swagger_auto_schema(
        method='post',
        operation_description='create an author',
        responses={
            200: openapi.Response(
                description='create an author',
                schema=UserSerializer()
            ),
            400: 'Bad request',
        },

)
@api_view(['POST'])
def create_author(request): 
    if request.method=='POST':
        serializer=UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            author=User.objects.get(pk=serializer.data['id'])
            inbox_object=Inbox.objects.create(author=author)
            inbox_object.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
@swagger_auto_schema(
        method='get',
        operation_description='Get an author',
        responses={
            200: openapi.Response(
                description='Get an author',
                schema=UserSerializer()
            ),
            404: 'Not found',
        },
)
@swagger_auto_schema(
        method='post',
        operation_description='Update an author',
        responses={
            200: openapi.Response(
                description='Update an author',
                schema=UserSerializer()
            ),
            400: 'Bad request',
            404: 'Not found',
        },
)
@swagger_auto_schema(
        method='put',
        operation_description='Update an author',
        responses={
            200: openapi.Response(
                description='Update an author',
                schema=UserSerializer()
            ),
            400: 'Bad request',
            404: 'Not found',
        },
)
@swagger_auto_schema(
        method='delete',
        operation_description='Delete an author',
        responses={
            200: openapi.Response(
                description='Delete an author',
                schema=UserSerializer()
            ),
            404: 'Not found',
        },
)
@api_view(['GET','POST', 'PUT', 'DELETE'])
def single_author_method(request,pk): 
    try:
        user=User.objects.get(pk=pk, type='AUTHOR')
    except User.DoesNotExist:
        return Response({"message":{f"No author with id {pk} exist"}},status=status.HTTP_404_NOT_FOUND)
    if request.method=='GET':
        serializer=UserSerializer(user)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='POST':
        serializer=UserSerializer(user,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method=='PUT':
        serializer=UserSerializer(user,data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method=='DELETE':
        user.delete()
        return Response({"message":f"author with id {pk} is deleted"},status=status.HTTP_200_OK)
      
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
Methods for testing purpose or still in progress
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
@api_view(['PUT'])
def testInbox(request):
    if request.method=='PUT':
        inbox=Inbox.objects.get(id=request.data['id'])
        inbox.items.update({ "2" : request.data['item']})
        inbox.save()
        serializer=InboxSerializer(inbox)
        return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_post(request): #for testing purpose
    if request.method=='GET':
        posts=Post.objects.all()
        serializer=PostSerializer(posts,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
@api_view(['GET'])
def get_all_like(request):
    if request.method=='GET':
        likes=Like.objects.all()
        serializer=LikeSerializer(likes,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
Like methods 
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
@swagger_auto_schema(
        method='delete',
        operation_description='Delete a like',
        responses={
            200: openapi.Response(
                description='Delete a like',
                schema=LikeSerializer()
            ),
            404: 'Not found',
        },
)
@swagger_auto_schema(
        method='put',
        operation_description='Update a like',
        responses={
            200: openapi.Response(
                description='Update a like',
                schema=LikeSerializer()
            ),
            400: 'Bad request',
            404: 'Not found',
        },
)
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
@swagger_auto_schema(
        method='post',
        operation_description='Create a like',
        responses={
            200: openapi.Response(
                description='Create a like',
                schema=LikeSerializer()
            ),
            400: 'Bad request',
        },
) 
@api_view(['POST'])
def create_like(request):
    if request.method=='POST':
        serializer=LikeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
@swagger_auto_schema(
        method='get',
        operation_description='Get likes of a post',
        responses={
            200: openapi.Response(
                description='Get likes of a post',
                schema=LikeSerializer(many=True)
            ),
        }
)
@api_view(['GET'])
def get_like_for_post(request,pk,postID):
    if request.method=='GET':
        likes=Like.objects.filter(object_id=postID,content_type=12)
        serializer=LikeSerializer(likes,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
@swagger_auto_schema(
        method='get',
        operation_description='Get a likes of an author',
        responses={
            200: openapi.Response(
                description='Get a likes of an author',
                schema=LikeSerializer(many=True)
            ),
        }
)
@api_view(['GET'])
def likes_of_single_author(request,pk):
    if request.method=='GET':
        likes=Like.objects.filter(author=pk)
        serializer=LikeSerializer(likes,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
@swagger_auto_schema(
        method='get',
        operation_description='get all likes of a comment on a post',
        responses={
            200: openapi.Response(
                description='get all likes of a comment on a post',
                schema=LikeSerializer(many=True)
            ),
        }
)
@api_view(['GET'])
def get_like_for_comment_on_post(request,pk, postID, cid):
    if request.method=='GET':
        likes=Like.objects.filter(object_id=cid,content_type=13)
        serializer=LikeSerializer(likes,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
@swagger_auto_schema(
        method='post',
        operation_description='Like a post',
        responses={
            200: openapi.Response(
                description='Like a post',
                schema=LikeSerializer()
            ),
            400: 'Bad request',
        },
)
@api_view(['POST'])
def like_single_post(request, pk,postID):
    if request.method=='POST':
        like=Like.objects.filter(object_id=postID,content_type=12,author=pk)
        if like.exists():
            return Response({"message":{f"Like already exists "}},status=status.HTTP_200_OK)
        serializer=LikeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
        method='get',
        operation_description='get inbox of an author',
        responses={
            200: openapi.Response(
                description='get inbox of an author',
                schema=InboxSerializer()
            ),
        }
)
@swagger_auto_schema(
        method='put',
        operation_description='update inbox of an author',
        responses={
            200: openapi.Response(
                description='update inbox of an author',
                schema=InboxSerializer()
            ),
        }
)
@api_view(['GET','PUT'])    
def inbox_methods(request,pk):
    if request.method=='GET':
        inbox=Inbox.objects.get(author=pk)
        serializer=InboxSerializer(inbox)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='PUT':
        inbox=Inbox.objects.get(author=pk)
        inbox.items=request.data
        inbox.save()
        serializer=InboxSerializer(inbox)
        return Response(serializer.data,status=status.HTTP_200_OK)
