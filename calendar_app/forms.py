from django.forms import Form, ModelForm, CharField, BooleanField, IntegerField, NullBooleanField, ModelChoiceField, HiddenInput, MultipleHiddenInput, ChoiceField, Textarea, EmailField, PasswordInput
from django import forms
from calendar_app.models import Users
from django.utils.translation import ugettext_lazy as _

class LoginUserForm(Form):
    username = CharField(
        label='Username', 
        help_text='', 
        required=True, 
        strip=True, 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'})) 
    password = CharField(
        label='Password', 
        help_text='', 
        required=True, 
        strip=True, 
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password'}))

class RegisterUserForm(ModelForm):
    
    username = CharField(
        label='Username', 
        help_text='joe1234', 
        required=True, 
        strip=True, 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'}))
    password = CharField(
        label='Password', 
        help_text='some super secret password', 
        required=True, 
        strip=True, 
        widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password'}))
    fullname = CharField(
        label='Full Name', 
        help_text='joe somebody', 
        required=True, strip=True, 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Full Name'}))
    email = EmailField(
        label='Email', 
        help_text='joe@example.com', 
        required=True, 
        strip=True, 
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Email'}))
    
    class Meta:
        model = Users
        fields = ('username',
            'password',
            'fullname',
            'email',
            )

class AddCalendarNameForm(ModelForm):
    calendar_name = CharField(
        label='Name of Calendar',
        help_text = 'Enter a Unique name of a Calendar',
        required=True,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'CalendarName'}))
       
    model = CalendarNames
    fields = ('calendar_name')
