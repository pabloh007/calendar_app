from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import TemplateView
from calendar_app.forms import RegisterUserForm, LoginUserForm

# Create your views here.

class LoginView(TemplateView):
    template_name = 'login.html'
    form_class = LoginUserForm

    def get(self, request, *args, **kwargs):
        form = self.form_class
        if request.GET.get('action',None) is not None and request.GET.get('action') == 'logout':
            logout(request)
            return HttpResponseRedirect('/calendar_app/')
        return render(request, self.template_name, {'form': form})
    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            user = authenticate(username=form.cleaned_data.get('username'), password=form.cleaned_data.get('password'))
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponseRedirect('/calendar_app/main/')
                else:
                    return render(request, self.template_name, {'form': form, 'error_message':'User is not is active, talk to admin'})
            else:
                return render(request, self.template_name, {'form': form, 'error_message':'Invalid Username/Password'})
        else:
            return render(request, self.template_name, {'form': form, 'error_message':'Please enter both username and password credentials'})

class RegisterUserView(TemplateView):
    form_class = RegisterUserForm
    template_name = 'register_form.html'
    def get(self, request, *args, **kwargs):
        form = self.form_class
        return render(request, self.template_name, {'form': form})  

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            user = User.objects.create_user(form.cleaned_data.get('username'), form.cleaned_data.get('email'), form.cleaned_data.get('password'))
            fullname = form.cleaned_data.get('fullname').split(' ')
            user.first_name = fullname[0]
            user.last_name = fullname[1:] if len(fullname) >1 else ''
            user.save()
            form.save()
            return HttpResponseRedirect('/calendar_app/')
        return render(request, self.template_name, {'form': form, 'error_message': 'Could not create user, please fix errors'})

class CalendarApplicationView(TemplateView):
    template_name = 'index.html'


