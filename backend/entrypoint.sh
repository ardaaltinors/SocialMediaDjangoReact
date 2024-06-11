#!/bin/sh

# Start Redis server in the background
redis-server --daemonize yes

# Start Daphne server
python manage.py runserver 0.0.0.0:8000