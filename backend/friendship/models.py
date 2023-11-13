from django.db import models
from user.models import User
class Friendship(models.Model):
    from_user = models.ForeignKey(User, related_name='from_users', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='to_users', on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['from_user', 'to_user'], name='unique_friendship')
        ]

class FriendRequest(models.Model):
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    DECLINED = 'declined'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (DECLINED, 'Declined'),
    ]

    from_user = models.ForeignKey(User, related_name='friend_requests_sent', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='friend_requests_received', on_delete=models.CASCADE)
    status = models.CharField(max_length=8, choices=STATUS_CHOICES, default=PENDING)

    def __str__(self):
        return f"{self.from_user.displayName} -> {self.to_user.displayName} is ({self.status})"

    class Meta:
        unique_together = ('from_user', 'to_user')
