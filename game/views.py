from django.shortcuts import render
from django.contrib.auth.decorators import login_required


# Create your views here.
@login_required
def create_game_room(request):
    username = request.user.username
    url = request.build_absolute_uri()
    request.user.profile.game_id += 1

    game_id = request.user.profile.game_id
    request.user.profile.save()

    return render(request, 'game/create_room.html', {
        'title': 'Create room', 'url': url, 'user': username,
        'game_id': game_id
    })


def start_game(request, creator, game_id):
    username = request.user.username
    room_name = creator + '_' + str(game_id)

    return render(request, 'game/start_game.html', {
        'title': 'Start Game', 'user': username,
        'creator': creator, 'room_name': room_name
    })
