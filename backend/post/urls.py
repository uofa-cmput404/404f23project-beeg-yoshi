from .models import Post
from . import views
from django.urls import path
urlpatterns = [
    path('authors/<str:pk>/posts/', views.create_post, name='create_post'),
    path('authors/<str:pk>/posts/<str:postID>', views.post_method, name='post_method'),
    path('authors/get/<str:pk>/posts/', views.get_public_and_friends_posts, name='get_public_and_friends_posts'),
]
