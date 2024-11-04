from wireframe_functions import *

'''
Rename all nodes in both networks with the same ids so that they can be morphed into each other.
Pairs of nodes chosen by proximity, optimised with Hungarian algorithm.
'''

network_files=[
    "../network_json/human.json", # Main network. All nodes preserved. Dimensions preserved.
    "../network_json/chicken.json", 
    "../network_json/virus.json", 
    "../network_json/crop.json", 
]

autoscale = False

alldata = []
for n in network_files:
    d = load_data(n)
    alldata.append(d)

for i in range(len(alldata)):
    for j in range(i+1, len(alldata)):
        alldata[i] = sort_data(alldata[i])
        alldata[j] = sort_data(alldata[j])
        print ("\n")
        print (f"{network_files[i]}: {len(alldata[i]['nodes'])} nodes. Centroid: {get_centroid(alldata[i])}")
        print (f"{network_files[j]}: {len(alldata[j]['nodes'])} nodes. Centroid: {get_centroid(alldata[j])}")
        if len(alldata[j]['nodes']) > len(alldata[i]['nodes']):
            alldata[j]['nodes'] = random.sample(alldata[j]['nodes'], len(alldata[i]['nodes']))
        if autoscale:
            scale_factor = calculate_scale_factor(alldata[0], alldata[j])
            print (f"Scale factor for {network_files[j]} (vs {network_files[0]}) = {scale_factor}%")
            alldata[j] = scale_network(alldata[j], scale_factor)
        alldata[i], alldata[j] = match_networks(alldata[i], alldata[j])
        alldata[i] = clean_network(alldata[i])
        alldata[j] = clean_network(alldata[j])

for i,n in enumerate(network_files):
    save_data(n.replace(".json","_matched.json"), alldata[i])







