from django.shortcuts import render
from .models import Post, Image
from .serializers import PostSerializer, ImageSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from user.models import User, UserToken
from comment.models import Comment
from friendship.models import Friendship
from django.db.models import Q
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
import base64
import os
from django.core.files.base import ContentFile
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import base64
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def service_account_login():
    creds = service_account.Credentials.from_service_account_file(
        './post/beeg-yoshi.json', scopes=SCOPES)
    return build('drive', 'v3', credentials=creds)
def get_mime_type(file_name):
    mime_types = {
        '.jpeg': 'image/jpeg',
        '.jpg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    }
    extension = os.path.splitext(file_name)[1].lower()
    return mime_types.get(extension, 'application/octet-stream')
def upload_file(service, file_name, mime_type, folder_id=None):
    file_metadata = {'name': file_name}
    if folder_id:
        file_metadata['parents'] = [folder_id]
    media = MediaFileUpload(file_name, mimetype=mime_type)
    file = service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    # print('File ID: %s' % file.get('id'))
    # https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
    # print('https://drive.google.com/uc?export=view&id=%s' % file.get('id'))
    return 'https://drive.google.com/uc?export=view&id=%s' % file.get('id')
    
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
        for post in posts:
            if post.unlisted and str(post.author.id) != logged_in_user:
                posts = posts.exclude(id=post.id)
        serializer = PostSerializer(posts, many=True)
        response=serializer.data
        for post in response:
            user=User.objects.get(pk=post["author"])
            post["author"]={
            "id":user.id,
            "host":user.host,
            "displayName":user.displayName,
            "url":user.url,
            "github":user.github,
            "profileImage":user.profileImage
            }
            comments=Comment.objects.filter(post=post["id"])
            post["comments"]=[]
            post["comments"]=list(comments.values())
        return Response(response, status=status.HTTP_200_OK)
@swagger_auto_schema(
    method='get',
    operation_description="Get all public posts",
    responses={200: PostSerializer(many=True)}
)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_public_posts(request):
    if request.method == 'GET':
        posts = Post.objects.filter(visibility='PUBLIC')
        serializer = PostSerializer(posts, many=True)
        response=serializer.data
        for post in response:
            user=User.objects.get(pk=post["author"])
            post["author"]={
            "id":user.id,
            "host":user.host,
            "displayName":user.displayName,
            "url":user.url,
            "github":user.github,
            "profileImage":user.profileImage
        }
            comments=Comment.objects.filter(post=post["id"])
            post["comments"]=[]
            post["comments"]=list(comments.values())
        return Response(response, status=status.HTTP_200_OK)
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
        if type(post.categories)==list:
            response["categories"]=post.categories
        else:
            response["categories"]=post.categories.split('and')
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
# @api_view(['GET'])
# def get_single_post_web_weavers(request,pk,postID):
#     try:
#         post=Post.objects.get(pk=postID, author=pk)
#     except Post.DoesNotExist:
#         return Response(status=status.HTTP_404_NOT_FOUND)
#     if request.method=='GET':
#         serializer=PostSerializer(post)
#         response=serializer.data
#         response["author"]={
#             "id":post.author.id,
#             "host":post.author.host,
#             "displayName":post.author.displayName,
#             "url":post.author.url,
#             "github":post.author.github,
#             "profileImage":post.author.profileImage
#         }
#         response["categories"]=post.categories.split('and')
#         response["id"]=post.source
#         return Response(response,status=status.HTTP_200_OK)
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
                post=Post.objects.get(pk=serializer.data["id"])
                post.source=f"https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/{user.id}/posts/{serializer.data['id']}/"
                post.origin=f"https://beeg-yoshi-backend-858f363fca5e.herokuapp.com"
                post.save()
                response=PostSerializer(post).data
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

@api_view(['POST'])
def image_method(request,pk,postID):
    if request.method=='POST':
        try:
            post=Post.objects.get(pk=postID,author=pk)
            imgstr = request.data["image"]
            # ext = 'png'
            # data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
            # temp_img_filename = 'image.' + ext
            # with open(temp_img_filename, 'wb') as temp_img_file:
            #     temp_img_file.write(data.read())
            # service = service_account_login()
            # mime_type = get_mime_type(temp_img_filename)
            # folder_id = '1qNjUQv5B5C1o45B0cdZNquNJxRtRotoF'
            # url=upload_file(service, temp_img_filename, mime_type, folder_id)
            account_name = 'beeg1yoshi2image'
            account_key = 'LaL3zT0jMPsBYn33HA/w/MFpI/gAkZLbBnsnIV3RVx/OquoyzESu5MzFXkjB4Oa9VH9JO9yaScrr+ASt4RPrSg=='
            container_name = 'image3store'
            blob_count = 0
            image_data=base64.b64decode(imgstr)
            blob_service_client = BlobServiceClient(account_url=f"https://{account_name}.blob.core.windows.net", credential=account_key)
            container_client = blob_service_client.get_container_client(container_name)
            for blob in container_client.list_blobs():
                blob_count += 1
            blob_name=f"{blob_count}.png"
            container_client.upload_blob(name=blob_name, data=image_data, overwrite=True)
            url=f"https://{account_name}.blob.core.windows.net/{container_name}/{blob_name}"
            image_object=Image.objects.create(post=post,image=url)
            image_object.save()
            serializer=ImageSerializer(image_object)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        except Post.DoesNotExist:
            return Response({"message":{f"No post with id {postID} exist, create image fail"}},status=status.HTTP_404_NOT_FOUND)
@api_view(['GET'])  
def get_all_images(request):
    if request.method=='GET':
        images=Image.objects.all()
        serializer=ImageSerializer(images,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
            