from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.test import TestCase
from .models import User, Like,UserToken
from post.models import Post
from friendship.models import Friendship

class UserAppTestCase(TestCase):
    def setUp(self):
        # Create test users and objects here
        self.user1 = User.objects.create(
            email='test1@example.com',
            password='testpassword1',
            displayName='testuser',
            github="test github 5",
            host="Test Host",
            url="Test Url",
        )
        self.user2 = User.objects.create(
            email='test@example.com',
            password='testpassword',
            displayName='testuser',
            github="test github 5",
            host="Test Host",
            url="Test Url",
        )
        self.friendship = Friendship.objects.create(from_user=self.user1, to_user=self.user2)
        self.client = APIClient()
        self.token = UserToken.objects.create(user=self.user1)
        self.token2 = UserToken.objects.create(user=self.user2)
    def test_login(self):
        url = reverse('login')
        data = {'email': self.user1.email, 'password': self.user1.password}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_author_list(self):
        url = reverse('author_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_author(self):
        url = reverse('create_author')
        data = {'displayName': 'newuser', 'email': 'newuser@example.com', 'password': 'newpassword123', 'github': 'new github', 'host': 'new host', 'url': 'new url'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_single_author_method_get(self):
        url = reverse('single_author_method', kwargs={'pk': self.user1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_single_author_method_put(self):
        url = reverse('single_author_method', kwargs={'pk': self.user1.pk})
        data = {'displayName': 'updateduser1'}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_single_author_method_delete(self):
        url = reverse('single_author_method', kwargs={'pk': self.user1.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_all_friendship_of_single_author(self):
        url = reverse('get_all_friendship_of_single_author', kwargs={'pk': self.user1.pk})
        self.client.credentials(HTTP_AUTHORIZATION= str(self.token.token))
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_stranger_of_single_author(self):
        url = reverse('get_stranger_of_single_author', kwargs={'pk': self.user1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
