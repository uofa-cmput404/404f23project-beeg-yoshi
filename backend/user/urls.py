from django.urls import path
from . import views
from .models import User,ServerAdmin, Like

urlpatterns = [
########################################################################################
#                          author                                            
########################################################################################
    path('authors/', views.author_list, name='author_list'),
    path('login/', views.login, name='login'),
    path('create/author/', views.create_author, name='create_author'),
    path('authors/<str:pk>/', views.single_author_method, name='single_author_method'),
    path('authors/<str:pk>/friends/', views.get_all_friendship_of_single_author, name='get_all_friendship_of_single_author'),
    path('remote/authors/<str:pk>/friends/', views.get_all_remote_friendship_of_single_author, name='get_all_remote_friendship_of_single_author'),
    path('authors/<str:pk>/strangers/', views.get_stranger_of_single_author,name='get_stranger_of_single_author'),
########################################################################################
#                         likes    
########################################################################################
    path('authors/<str:pk>/posts/<str:postID>/likes', views.get_like_for_post, name='get_like_for_post'),
    path('authors/<str:pk>/posts/<str:postID>/comments/<str:cid>/likes', views.get_like_for_comment_on_post, name='get_like_for_comment_on_post'),
    path('authors/<str:pk>/liked',views.likes_of_single_author, name='likes_of_single_author'),
    path('authors/<str:pk>/like/<str:postID>/', views.like_single_post, name='like_single_post'),
    path('remote/authors/like/<str:postID>/', views.create_remote_like, name='create_remote_like'),

########################################################################################
#                      testing purpose  
########################################################################################
    path('test/inbox', views.testInbox),
    path('test/posts', views.get_all_post),
    path('test/likes', views.get_all_like),
########################################################################################
#                      Inbox  
########################################################################################
    path('authors/<str:pk>/inbox/', views.inbox_methods, name='inbox_methods'),
########################################################################################
#                      node 
########################################################################################
    path('admin/node/', views.node_methods, name='node_methods'),
]   

