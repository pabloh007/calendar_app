from django.db import models

# Create your models here.

class Users(models.Model):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    fullname = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)

class CalendarNames(models.Model):
    calendar_name = models.CharField(max_length=100, unique=True)
    timestamp_created = models.DateTimeField(auto_now_add=True)

class Calendar(models.Model):
    title = models.CharField(max_length=250)
    timestamp_start = models.DateTimeField()
    timestamp_end = models.DateTimeField()
    calendarnames = models.ForeignKey(CalendarNames)
    shared = models.BooleanField()
    users = models.ForeignKey(Users)

class CalendarNotes(models.Model):
    note_text = models.TextField()
    users = models.ForeignKey(Users)
    calendar = models.ForeignKey(Calendar)
    timestamp_created = models.DateTimeField(auto_now_add=True)
    shared = models.BooleanField()






