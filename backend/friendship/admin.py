from django.contrib import admin
from .models import Friendship, FriendRequest, remoteFriendRequest, remoteFriendship

admin.site.register(Friendship)
admin.site.register(FriendRequest)
admin.site.register(remoteFriendRequest)
admin.site.register(remoteFriendship)
# Register your models here.
