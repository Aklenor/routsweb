# Generated by Django 3.2.13 on 2022-05-16 14:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Availability',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=5)),
            ],
        ),
        migrations.CreateModel(
            name='Difficulty',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Direction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Surface',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='RouteCollections',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(help_text='Название подборки', max_length=200)),
                ('min_distance', models.PositiveIntegerField(help_text='Минимальная длина маршрута')),
                ('max_distance', models.PositiveIntegerField(help_text='Максимальная длина маршрута')),
                ('image', models.ImageField(null=True, upload_to='uploads/')),
                ('difficulty', models.ManyToManyField(help_text='Сложность маршрутов', to='routs.Difficulty')),
                ('direction', models.ManyToManyField(help_text='Направление. Маршрут попадет в подборку, если у него совпадает хотя бы одно направление', to='routs.Direction')),
                ('is_transport_availability', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='routs.availability')),
                ('surface', models.ManyToManyField(help_text='Тип покрытия', to='routs.Surface')),
                ('tags', models.ManyToManyField(help_text='Особенности. Маршрут попадет в подборку, если у него совпадает хотя бы одна особенность', to='routs.Tag')),
            ],
        ),
        migrations.CreateModel(
            name='Rout',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('distance', models.PositiveIntegerField(help_text='Enter distance in kilometers, or min distance if range')),
                ('distance_max', models.PositiveIntegerField(help_text='If range - enter max distance, else - enter 0', null=True)),
                ('is_transport_availability', models.BooleanField(default=False)),
                ('description', models.CharField(max_length=1000)),
                ('goggle_map_link', models.CharField(max_length=200)),
                ('bike_map_link', models.CharField(max_length=200)),
                ('kml_file_link', models.CharField(max_length=200)),
                ('wallpaper_image', models.ImageField(null=True, upload_to='uploads/')),
                ('difficulty', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='routs.difficulty')),
                ('direction', models.ManyToManyField(to='routs.Direction')),
                ('surface', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='routs.surface')),
                ('tags', models.ManyToManyField(help_text='Select characteristics', to='routs.Tag')),
            ],
        ),
    ]
