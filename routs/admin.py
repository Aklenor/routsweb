from django.contrib import admin
from .models import Rout, Difficulty, Surface, Direction, Tag, RouteCollections

admin.site.register(Rout)
admin.site.register(Difficulty)
admin.site.register(Surface)
admin.site.register(Direction)
admin.site.register(Tag)
admin.site.register(RouteCollections)
