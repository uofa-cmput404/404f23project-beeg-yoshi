from django.contrib import admin
from .models import User,ServerAdmin,Like,Inbox

admin.site.register(User)
admin.site.register(ServerAdmin)
admin.site.register(Like)
admin.site.register(Inbox)
# Register your models here.
