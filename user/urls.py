from django.urls import path
from . import views
from .models import User,ServerAdmin, Comment, Post, Like, Friendship

urlpatterns = [
    path('authors/', views.author_list),
    path('authors/<str:pk>/', views.single_author_method),
    path('authors/<str:pk>/followers', views.get_followers_of_single_author),
    path('service/authors/<str:pk>/followers/<str:fk>', views.single_friendship_method),
    path('service/befriend/', views.Be_friend),
]

