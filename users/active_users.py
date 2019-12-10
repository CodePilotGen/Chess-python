from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.utils import timezone


def get_current_users():
    active_sessions = Session.objects.filter(expire_date__gte=timezone.now())
    print(active_sessions)
    user_id_list = []

    for session in active_sessions:
        data = session.get_decoded()
        print(data)
        user_id_list.append(data.get('_auth_user_id'))
        print(user_id_list)

    # Query all logged in users based on id list
    return User.objects.filter(id__in=user_id_list)
