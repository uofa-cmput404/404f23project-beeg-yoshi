from django.test import TestCase

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import User, Post, Comment
from .serializers import CommentSerializer

class CommentTestCase(TestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create(
            email='test@example.com',
            password='testpassword',
            displayName='testuser',
            github="test github 5",
            host="Test Host",
            url="Test Url",
        )

        # Create a post
        self.post = Post.objects.create(
            title='Test Post',
            source="Postman create source1",
            origin="Postman create origin1",
            description="Postman create description1",
            contentType="text/plain",
            categories="web",
            content='Some test content',
            author=self.user,
        )

        self.comment = Comment.objects.create(
            comment='A test comment',
            post=self.post,
            author=self.user,
            contentType='text/plain',
        )

        self.client = APIClient()

    def test_get_comments(self):
        url = reverse('comment_on_post', kwargs={'pk': self.user.id, 'postID': self.post.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = CommentSerializer(self.comment)
        self.assertEqual(response.data[0]['id'], serializer.data['id'])
        self.assertEqual(response.data[0]['comment'], serializer.data['comment'])
        self.assertEqual(response.data[0]['contentType'], serializer.data['contentType'])
        self.assertEqual(response.data[0]['author']['id'], serializer.data['author'])


    def test_post_comment(self):
        self.client.force_authenticate(user=self.user)
        comment_data = {
            'comment': 'Another test comment',
            'contentType': 'text/plain',
            'post':self.post.id,
            'author':self.user.id,
        }
        url = reverse('comment_on_post', kwargs={'pk': self.user.id, 'postID': self.post.id})
        response = self.client.post(url, comment_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 2)

