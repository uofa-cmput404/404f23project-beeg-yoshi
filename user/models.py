from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager
from django.core.exceptions import ValidationError
class User(AbstractBaseUser):
    id=models.CharField(max_length=1024,primary_key=True)
    url=models.CharField(max_length=1024)
    host=models.CharField(max_length=1024)
    displayName=models.CharField(max_length=1024)
    github=models.CharField(max_length=1024)
    profileImage=models.ImageField(blank=True)
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
    bidirectional = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['from_user', 'to_user'], name='unique_friendship')
        ]
class ServerAdmin(User):
    base_role=User.Role.SERVER_ADMIN
    Admin_id=models.AutoField(primary_key=True)
    def __str__(self):
        return self.displayName+" Role: "+ self.type

class Post(models.Model):
    title=models.CharField(max_length=512)
    id=models.CharField(max_length=1024,primary_key=True)
    author=models.ForeignKey(User,on_delete=models.CASCADE)
    source=models.CharField(max_length=1024)
    origin=models.CharField(max_length=1024)
    description=models.CharField(max_length=1024)
    contentType=models.CharField(max_length=1024)
    content=models.TextField()

class Like(models.Model):
    id=models.CharField(max_length=1024,primary_key=True)
    author=models.ForeignKey(User,on_delete=models.CASCADE)
    post=models.ForeignKey(Post,on_delete=models.CASCADE)
    def __str__(self):
        return self.author.displayName + " likes " + self.post.title

class Comment(models.Model):
    id=models.CharField(max_length=1024,primary_key=True)
    author=models.ForeignKey(User,on_delete=models.CASCADE)
    post=models.ForeignKey(Post,on_delete=models.CASCADE)
    comment=models.TextField()  
    contentType=models.CharField(max_length=1024)
    published=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.comment + " by " + self.author.displayName + " on " + self.post.title