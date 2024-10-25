

import random

columns = [1,2,3,4,5,6]

newnodes = []
newvariants = []

for i in range(100):
	newvariant = "var{}".format(i)
	newvariants.append(newvariant)
	newnode = "new{}".format(i)
	newnodes.append(newnode)
	y1 = 50 + int(random.random()*600)
	y2 = 50 + int(random.random()*600)
	c = random.choice(columns)
	print (f'''addNode("{newvariant}", 0, {y1}, 10, 0);
addNode("{newnode}", {c}, {y2}, 10, 0);
drawNewLink("{newvariant}", "{newnode}");''')

newedges = []
for j in range(40):
	ne = sorted(random.sample(newnodes,2))
	if ne not in newedges:
		newedges.append(ne)
		newedges.append([random.choice(newvariants), ne[0]])
		newedges.append([random.choice(newvariants), ne[1]])
for e in newedges:
	print (f'drawNewLink("{e[0]}", "{e[1]}");')

			









