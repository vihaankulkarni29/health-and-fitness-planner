import multiprocessing
import os

# Gunicorn config variables
bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
keepalive = 120
timeout = 120
accesslog = "-"
errorlog = "-"
loglevel = "info"

# For debugging
reload = os.getenv("RELOAD", "false").lower() == "true"
