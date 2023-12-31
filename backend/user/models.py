from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager
import uuid
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class User(AbstractBaseUser):
    id=models.AutoField(primary_key=True)
    email=models.EmailField(max_length=1024,unique=True)
    password=models.CharField(max_length=1024)
    url=models.CharField(max_length=1024, blank=True)
    host=models.CharField(max_length=1024,default='https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/')
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

# class FriendRequest(models.Model):
#     from_user = models.ForeignKey(User, related_name='from_user', on_delete=models.CASCADE)
#     to_user = models.ForeignKey(User, related_name='to_user', on_delete=models.CASCADE)
#     accepted = models.BooleanField(default=False)


class ServerAdmin(User):
    base_role=User.Role.SERVER_ADMIN
    Admin_id=models.AutoField(primary_key=True)
    def __str__(self):
        return self.displayName+" Role: "+ self.type
class UserToken(models.Model):
    id=models.AutoField(primary_key=True)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    token=models.UUIDField(default=uuid.uuid4,editable=False)
    def __str__(self):
        return self.user.displayName + "'s token"

class Like(models.Model):
    type=models.CharField(default="like",max_length=1024)
    id=models.AutoField(primary_key=True)
    author=models.ForeignKey(User,on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, default=18)
    object_id = models.CharField(max_length=1024)
    object=GenericForeignKey("content_type", "object_id")
    def __str__(self):
        return self.author.displayName + " likes "
class Inbox(models.Model):
    id = models.AutoField(primary_key=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    def default_items():
        return {"inbox": [], "notifications": [], "friendrequests": []}
    items = models.JSONField(default=default_items)
    def __str__(self):
        return self.author.displayName + " inbox"
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['author'], name='unique_author_inbox')
        ]

class remoteLike(models.Model):
    type=models.CharField(default="remote like",max_length=1024)
    id=models.AutoField(primary_key=True)
    author=models.CharField(max_length=1024)
    displayName=models.CharField(max_length=1024,default="unknown")
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, default=18)
    object_id = models.CharField(max_length=1024)
    object=GenericForeignKey("content_type", "object_id")
    server=models.CharField(max_length=1024,default="unknown")
    def __str__(self):
        return self.displayName + " likes "

class node(models.Model):
    name=models.CharField(max_length=1024)
    active=models.BooleanField(default=True)
    def __str__(self):
        return self.name + " is " + "active" if self.active else "inactive"