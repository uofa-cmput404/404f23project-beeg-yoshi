from django.contrib import admin
from .models import Comment, remoteComment

admin.site.register(Comment)
admin.site.register(remoteComment)
# Register your models here.
