from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from user.models import User
from .models import Post
from friendship.models import Friendship

class PostTestCase(TestCase):
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
        Friendship.objects.create(from_user=self.user1, to_user=self.user2)
        self.public_post = Post.objects.create(
            title='Public Post', 
            author=self.user1, 
            visibility=Post.Visibility.PUBLIC, 
            content='Some test content', 
            source="Test source1",
            origin="Test origin1",
            description="Test description1",
            contentType="text/plain",
            categories= ['test1', 'test2']                              
        )
        self.private_post = Post.objects.create(
            title='Private Post', 
            author=self.user2, visibility=Post.Visibility.PRIVATE, 
            content='Some test content',
            source="Test source1",
            origin="Test origin1",
            description="Test description1",
            contentType="text/plain",
            categories= ['test1', 'test2']
            )
        self.client = APIClient()

    def test_get_public_and_friends_posts(self):
        url = reverse('get_public_and_friends_posts', kwargs={'pk': self.user1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_post(self):
        url = reverse('create_post', kwargs={'pk': self.user1.pk})
        post_data = {'title': 'New Post', 'content': 'Content of the new post', 'visibility': Post.Visibility.PUBLIC, 'author': self.user1.pk, 'source': 'Test source', 'origin': 'Test origin', 'description': 'Test description', 'contentType': 'text/plain'}
        response = self.client.post(url, post_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_single_post(self):
        url = reverse('post_method', kwargs={'pk': self.user1.pk, 'postID': self.public_post.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_post(self):
        url = reverse('post_method', kwargs={'pk': self.user1.pk, 'postID': self.public_post.pk})
        update_data = {'title': 'Updated Title'}
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_post(self):
        url = reverse('post_method', kwargs={'pk': self.user1.pk, 'postID': self.public_post.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_all_posts_of_author(self):
        url = reverse('create_post', kwargs={'pk': self.user1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
