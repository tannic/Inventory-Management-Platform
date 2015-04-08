from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.core.context_processors import csrf
from django.contrib import auth
from django.contrib.auth.decorators import login_required

def login(request):
	return render_to_response('login.html', RequestContext(request)) 

def signup(request):
	return render_to_response('signup.html', RequestContext(request)) 

def home(request):
	return render_to_response('home.html', RequestContext(request)) 
	
@login_required
def index(request):
	return render_to_response('index.html', RequestContext(request)) 

@login_required
def logout(request):
	auth.logout(request)
	return render_to_response('login.html', RequestContext(request)) 