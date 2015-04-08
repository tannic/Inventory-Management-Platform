import os
import sys

path = '/home/ubuntu/invenmgt2/'

if path not in sys.path:
	sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'invenmgt2.settings'

import django.core.handlers.wsgi

application = django.core.handlers.wsgi.WSGIHandler()
