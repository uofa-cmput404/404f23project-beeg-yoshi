from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager
from django.core.exceptions import ValidationError
import datetime
import uuid
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
class User(AbstractBaseUser):
    id=models.AutoField(primary_key=True)
    email=models.EmailField(max_length=1024,unique=True)
    password=models.CharField(max_length=1024)
    url=models.CharField(max_length=1024)
    host=models.CharField(max_length=1024)
    is_active=models.BooleanField(default=False)
    displayName=models.CharField(max_length=1024)
    github=models.CharField(max_length=1024)
    profileImage=models.CharField(max_length=1024, blank=True)
    biography=models.TextField(default="I am too lazy to leave a bio.....")
    USERNAME_FIELD='displayName'
    def __str__(self):
        return self.displayName + " Role: " + self.type

    class Role(models.TextChoices):
        AUTHOR = 'AUTHOR', 'Author'
        SERVER_ADMIN = 'SERVERADMIN', 'ServerAdmin'
    base_role = Role.AUTHOR
    type = models.CharField(max_length=50, choices=Role.choices, default=base_role)

class Friendship(models.Model):
    from_user = models.ForeignKey(User, related_name='from_users', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='to_users', on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['from_user', 'to_user'], name='unique_friendship')
        ]
# class FriendRequest(models.Model):
#     from_user = models.ForeignKey(User, related_name='from_user', on_delete=models.CASCADE)
#     to_user = models.ForeignKey(User, related_name='to_user', on_delete=models.CASCADE)
#     accepted = models.BooleanField(default=False)


class ServerAdmin(User):
    base_role=User.Role.SERVER_ADMIN
    Admin_id=models.AutoField(primary_key=True)
    def __str__(self):
        return self.displayName+" Role: "+ self.type

class Post(models.Model):
    type=models.CharField(default="post",max_length=1024)
    title=models.CharField(max_length=512)
    id=models.AutoField(primary_key=True)
    source=models.CharField(max_length=1024)
    origin=models.CharField(max_length=1024)
    description=models.CharField(max_length=1024)
    contentType=models.CharField(max_length=1024)
    content=models.TextField()
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
class Like(models.Model):
    type=models.CharField(default="like",max_length=1024)
    id=models.AutoField(primary_key=True)
    author=models.ForeignKey(User,on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.CharField(max_length=1024)
    object=GenericForeignKey("content_type", "object_id")
    def __str__(self):
        return self.author.displayName + " likes " + str(self.object)
class Inbox(models.Model):
    id=models.CharField(max_length=1024,primary_key=True)
    author=models.ForeignKey(User,on_delete=models.CASCADE)
    items=models.JSONField(default=dict)
    def __str__(self):
        return self.author.displayName + " inbox"