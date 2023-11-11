from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import User, Friendship

class FriendshipTestCase(TestCase):
    def setUp(self):
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

    def test_get_single_friendship(self):
        url = reverse('single_friendship_method', kwargs={'pk': self.user2.id, 'fk': self.user1.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_followers_of_single_author(self):
        url = reverse('get_followers_of_single_author', kwargs={'pk': self.user2.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_single_friendship(self):
        url = reverse('single_friendship_method', kwargs={'pk': self.user2.id, 'fk': self.user1.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

