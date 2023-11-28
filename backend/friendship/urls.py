from django.urls import path
from . import views

urlpatterns = [
    path('authors/<str:pk>/followers/', views.get_followers_of_single_author, name='get_followers_of_single_author'),
    path('authors/<str:pk>/followers/<str:fk>/', views.single_friendship_method, name='single_friendship_method'),
    path('authors/<str:pk>/request/<str:fk>/', views.friend_request_methods, name='friend_request_methods'),
    path('authors/<str:pk>/request/pending', views.get_pending_friend_request, name='get_pending_friend_request'),
    #______________________________________________________remote______________________________________________________
    path('remote/authors/<str:pk>/followers/', views.get_remote_followers_of_single_author, name='get_remote_followers_of_single_author'),
    path('remote/authors/<str:pk>/followers/<str:fk>/', views.single_remote_friendship_methods, name='single_remote_friendship_methods'),
    path('remote/authors/<str:pk>/request/<str:fk>/', views.remote_friend_request_methods, name='remote_friend_request_methods'),
    path('remote/authors/<str:pk>/pending/request/', views.get_remote_pending_friend_request, name='get_remote_pending_friend_request'),
]