from django.urls import path
from . import views

urlpatterns = [
    path('authors/<str:pk>/followers/', views.get_followers_of_single_author, name='get_followers_of_single_author'),
    path('authors/<str:pk>/followers/<str:fk>/', views.single_friendship_method, name='single_friendship_method'),
]