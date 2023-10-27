from django.contrib import admin
from .models import User,ServerAdmin,Friendship,Comment,Post,Like,Inbox

admin.site.register(User)
admin.site.register(ServerAdmin)
admin.site.register(Friendship)
admin.site.register(Comment)
admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Inbox)
# Register your models here.
