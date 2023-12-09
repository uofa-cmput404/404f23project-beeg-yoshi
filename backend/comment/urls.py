from django.urls import path
from . import views

urlpatterns = [
    path('authors/<str:pk>/posts/<str:postID>/comments', views.comment_on_post, name='comment_on_post'),
    path('remote/posts/<str:postID>/comments', views.remote_comment_on_post, name='remote_comment_on_post'),
]
