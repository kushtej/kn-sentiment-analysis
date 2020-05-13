from django.conf.urls import url
from api import views

urlpatterns=[
    url('v1',views.version1,name='version1'),
    url('v2',views.version2,name='version2')
]