import json
from math import sqrt
from wireframe_functions import *

jsonfile = '../json/virus.json'
min_edges = 8
output_jsonfile = '../json/virus_edges.json'

def ensure_min_edges(data, min_edges):
    nodes = data['nodes']
    links = data['links']
    connections = {node['id']: set() for node in nodes}
    for link in links:
        connections[link['source']].add(link['target'])
        connections[link['target']].add(link['source'])
    def find_nearest_nodes(node, nodes, exclude_ids):
        def distance(n1, n2):
            return sqrt((n1['x'] - n2['x']) ** 2 + (n1['y'] - n2['y']) ** 2 + (n1['z'] - n2['z']) ** 2)
        node_distances = [(n, distance(node, n)) for n in nodes if n['id'] != node['id'] and n['id'] not in exclude_ids]
        node_distances.sort(key=lambda x: x[1])
        return [n for n, d in node_distances]
    for node in nodes:
        print (len(connections[node['id']]))
        if len(connections[node['id']]) < min_edges:
            needed_edges = min_edges - len(connections[node['id']])
            nearest_nodes = find_nearest_nodes(node, nodes, connections[node['id']])
            for i in range(needed_edges):
                if i < len(nearest_nodes):
                    target_node = nearest_nodes[i]
                    if target_node['id'] not in connections[node['id']]:
                        if node['id'] not in connections[target_node['id']]:
                            connections[node['id']].add(target_node['id'])
                            connections[target_node['id']].add(node['id'])
                            links.append({"source": node['id'], "target": target_node['id']})
    return data

data = load_data(jsonfile)
data = ensure_min_edges(data, min_edges)
save_data(output_jsonfile, data)
