import sys
name=sys.argv[1]


f = open(name,'r').read()
count=int(f)
count+=1
print(count)
f1 = open(name,'w')
f1.write(str(count))




