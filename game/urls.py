from django.urls import path

from . import views

urlpatterns = [
    path('', views.create_game_room, name='game'),
    path('<str:creator>/<int:game_id>/', views.start_game, name='start_game'),
]
