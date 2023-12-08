from django.contrib import admin
from .models import User,ServerAdmin,Like,Inbox, UserToken, remoteLike,node
admin.site.register(User)
admin.site.register(ServerAdmin)
admin.site.register(Like)
admin.site.register(Inbox)
admin.site.register(UserToken)
admin.site.register(remoteLike)
admin.site.register(node)
