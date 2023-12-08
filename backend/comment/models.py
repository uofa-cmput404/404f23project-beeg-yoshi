from django.db import models
from user.models import User
from post.models import Post
class Comment(models.Model):
    type=models.CharField(default="comment",max_length=1024)
    id=models.AutoField(primary_key=True)
    author=models.ForeignKey(User,on_delete=models.CASCADE)
    post=models.ForeignKey(Post,on_delete=models.CASCADE)
    comment=models.TextField()  
    contentType=models.CharField(max_length=1024)
    published=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.comment + " by " + self.author.displayName 

class remoteComment(models.Model):
    type=models.CharField(default="comment",max_length=1024)
    id=models.AutoField(primary_key=True)
    author=models.CharField(max_length=1024)
    displayName=models.CharField(max_length=1024,default="unknown")
    post=models.ForeignKey(Post,on_delete=models.CASCADE)
    comment=models.TextField()  
    contentType=models.CharField(max_length=1024, default="text/plain")
    published=models.DateTimeField(auto_now_add=True)
    server=models.CharField(max_length=1024,default="unknown")
    def __str__(self):
        return self.comment + " by " + self.displayName
