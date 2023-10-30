from django.urls import path
from . import views
from .models import User,ServerAdmin, Comment, Post, Like, Friendship

urlpatterns = [
########################################################################################
#                          author                                            
########################################################################################
    path('authors/', views.author_list),
    path('login/', views.login),
    path('create/author/', views.create_author),
    path('authors/<str:pk>/', views.single_author_method),
    path('authors/<str:pk>/friends/', views.get_all_friendship_of_single_author),
    path('authors/<str:pk>/strangers/', views.get_stranger_of_single_author),

########################################################################################
#                       followers(friend)                                              
########################################################################################
    path('authors/<str:pk>/followers/', views.get_followers_of_single_author),
    path('authors/<str:pk>/followers/<str:fk>/', views.single_friendship_method),

########################################################################################
#                         posts         
########################################################################################
    path('authors/<str:pk>/posts/', views.create_post),
    path('authors/<str:pk>/posts/<str:postID>', views.post_method),
    path('authors/get/<str:pk>/posts/', views.get_public_and_friends_posts),
########################################################################################
#                         comments      
########################################################################################
    path('authors/<str:pk>/posts/<str:postID>/comments', views.comment_on_post),

    
########################################################################################
#                         likes    
########################################################################################
    path('authors/<str:pk>/posts/<str:postID>/likes', views.get_like_for_post),
    path('authors/<str:pk>/posts/<str:postID>/comments/<str:cid>/likes', views.get_like_for_comment_on_post),
    path('authors/<str:pk>/liked',views.likes_of_single_author),
    path('authors/<str:pk>/like/<str:postID>/', views.like_single_post),


########################################################################################
#                      testing purpose  
########################################################################################
    path('test/inbox', views.testInbox),
    path('test/posts', views.get_all_post),
    path('test/likes', views.get_all_like),
    
]   

