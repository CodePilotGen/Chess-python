from django.shortcuts import render
from django.http import HttpResponse
from users.active_users import get_current_users


# Create your views here.
def home_page(request):
    active_users = get_current_users()

    return render(
        request, 'chess_app/home.html',
        {
            'title': 'Home', 'active_users': active_users
        }
    )
