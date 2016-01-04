"""dev_projects URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Import the include() function: from django.conf.urls import url, include
    3. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import url
from django.contrib import admin
from calendar_app.views import LoginView, RegisterUserView, CalendarApplicationView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^calendar_app/$', LoginView.as_view(), name='login'),
    url(r'^calendar_app/register/$', RegisterUserView.as_view(), name='register'),
    url(r'^calendar_app/main/$', CalendarApplicationView.as_view(), name='app_main'),
]
