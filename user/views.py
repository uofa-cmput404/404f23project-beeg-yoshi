from django.shortcuts import render
from .models import User,ServerAdmin, Comment, Post, Like, Friendship,Inbox
from .serializers import UserSerializer, CommentSerializer, PostSerializer, LikeSerializer, FriendshipSerializer,InboxSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
Author methods
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
@api_view(['GET'])
def author_list(request):  
    if request.method=='GET':
        users=User.objects.filter(type='AUTHOR')
        serializer=UserSerializer(users,many=True)
        return Response(serializer.data)
@api_view(['POST'])
def create_author(request): 
    if request.method=='POST':
        serializer=UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
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
        serializer=UserSerializer(user,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    elif request.method=='DELETE':
        user.delete()
        return Response({"message":f"author with id {pk} is deleted"},status=status.HTTP_200_OK)

"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
Post methods
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
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
    
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
Friendship methods
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
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
Comment methods
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
# @api_view(['GET', 'DELETE', 'PUT'])
# def single_comment_method(request,pk):
#     try:
#         comment=Comment.objects.get(pk=pk)
#     except Comment.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
#     if request.method=='GET':
#         serializer=CommentSerializer(comment)
#         return Response(serializer.data,status=status.HTTP_200_OK)
#     elif request.method=='PUT':
#         serializer=CommentSerializer(comment,data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data,status=status.HTTP_200_OK)
#         return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
#     elif request.method=='DELETE':
#         comment.delete()
#         return Response(status=status.HTTP_200_OK)
@api_view(['GET', 'POST'])
def comment_on_post(request,pk,postID):
    if request.method=='GET':
        comments=Comment.objects.filter(post=pk)
        serializer=CommentSerializer(comments,many=True)
        print(serializer.data)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='POST':
        request.data.update({"post":postID, "author":pk})
        serializer=CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            post=Post.objects.get(pk=postID)
            post.count+=1
            post.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
Like methods 
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

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
def get_like_for_post(request,pk,postID):
    if request.method=='GET':
        likes=Like.objects.filter(object_id=postID,content_type=9)
        serializer=LikeSerializer(likes,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
def likes_of_single_author(request,pk):
    if request.method=='GET':
        likes=Like.objects.filter(author=pk)
        serializer=LikeSerializer(likes,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
@api_view(['GET'])
def get_like_for_comment_on_post(request,pk, postID, cid):
    if request.method=='GET':
        likes=Like.objects.filter(object_id=cid,content_type=13)
        serializer=LikeSerializer(likes,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)