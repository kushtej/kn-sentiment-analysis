from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

def version1(req):
    import json 
    import os
    json_path = os.path.dirname(__file__)+'/kn-lexicons/06-(m)AFINN-nltk-genralized.json'
    f = open(json_path,) 
    data = json.load(f) 

    return HttpResponse(json.dumps(data))

def version2(req):
    import json 
    import os
    json_path = os.path.dirname(__file__)+'/kn-lexicons/08-kn-golder-corpus-lexicons.json'
    f = open(json_path,) 
    data = json.load(f) 

    return HttpResponse(json.dumps(data))