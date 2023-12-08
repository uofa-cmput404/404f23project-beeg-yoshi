from django.db import models
from user.models import User
import datetime
class Post(models.Model):
    type=models.CharField(default="post",max_length=1024)
    title=models.CharField(max_length=512)
    id=models.AutoField(primary_key=True)
    source=models.CharField(max_length=1024, blank=True)
    origin=models.CharField(max_length=1024, blank=True)
    description=models.CharField(max_length=1024, blank=True)
    contentType=models.CharField(max_length=1024, default="text/plain")
    content=models.TextField(blank=True)
    author=models.ForeignKey(User,on_delete=models.CASCADE)
    categories=models.JSONField(blank=True,null=True)
    count=models.PositiveIntegerField(default=0)
    comments=models.CharField(max_length=1024,blank=True)
    published = models.DateTimeField(default=datetime.datetime.now)
    class Visibility(models.TextChoices):
        PRIVATE = 'FRIENDS', 'Friends'
        PUBLIC = 'PUBLIC', 'Public'
    visibility = models.CharField(
        max_length=10,
        choices=Visibility.choices,
        default=Visibility.PUBLIC,
    )
    unlisted = models.BooleanField(default=False)
    def __str__(self):
        return self.content

class Image(models.Model):
    post=models.ForeignKey(Post,on_delete=models.CASCADE)
    image=models.URLField()
    def __str__(self):
        return self.post.title
