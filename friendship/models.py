from django.db import models
from user.models import User
class Friendship(models.Model):
    from_user = models.ForeignKey(User, related_name='from_users', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='to_users', on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['from_user', 'to_user'], name='unique_friendship')
        ]
