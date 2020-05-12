import re
import json 
import sys
import requests

txt=sys.argv[1]

def convert():
    url = 'http://127.0.0.1:8000/api/v2/'

    try:
        response = requests.get(url)
        #print(response)
    except requests.exceptions.RequestException as e:
        return

    data = response.json()
    #print(data.get('\u0ca4\u0ccd\u0caf\u0c9c\u0cbf\u0cb8\u0cbf\u0cbf'))
    return data


data=convert()
#print(data)

lexi=[]

for key,values in data.items():
    lexi.append(key)

txt = re.sub(r"[A-Za-z0-9`'-()\"#/@;:<>{}`+=~|.!?,]", "", txt)
txt_lst=txt.split()

pos_words=0
neg_words=0

flag=0
pos_words_lst=[]
neg_words_lst=[]
for i in txt_lst:
    for j in lexi:
        if (i.find(j) == -1): 
            #print("NO")
            continue 
        else:
            if(flag==0):    
                flag=1
                if(data[j]>0):
                    pos_words_lst.append(i)
                    pos_words+=1
                elif(data[j]<0):
                    neg_words_lst.append(i)
                    neg_words+=1
    flag=0


#print("pos words="+str(pos_words))
#print("pos")
for i in pos_words_lst: 
    print(i)
#print(pos_words_lst)

print("neg")
for i in neg_words_lst: 
    print(i)
