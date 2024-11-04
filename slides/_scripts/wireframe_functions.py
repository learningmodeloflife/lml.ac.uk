import json
import random
import numpy as np
from scipy.optimize import linear_sum_assignment


def load_data(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def save_data(file_path, data):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=2)

def centre_network(data, center=[0,0,0]):
    avg_x, avg_y, avg_z = get_centroid(data)
    nodes = data.get('nodes', [])
    for node in nodes:
        node['x'] = node['x'] - avg_x + center[0]
        node['y'] = node['y'] - avg_y + center[1]
        node['z'] = node['z'] - avg_z + center[2]
    return data

def get_centroid(data):
    nodes = data.get('nodes', [])
    avg_x = sum(node['x'] for node in nodes) / len(nodes)
    avg_y = sum(node['y'] for node in nodes) / len(nodes)
    avg_z = sum(node['z'] for node in nodes) / len(nodes)
    return avg_x, avg_y, avg_z

def calculate_bounding_box(network):
    min_x = min_y = min_z = float('inf')
    max_x = max_y = max_z = float('-inf')
    for node in network["nodes"]:
        min_x = min(min_x, node["x"])
        max_x = max(max_x, node["x"])
        min_y = min(min_y, node["y"])
        max_y = max(max_y, node["y"])
        min_z = min(min_z, node["z"])
        max_z = max(max_z, node["z"])
    return {
        "min_x": min_x, "max_x": max_x,
        "min_y": min_y, "max_y": max_y,
        "min_z": min_z, "max_z": max_z
    }

def calculate_scale_factor(network1, network2):
    bbox1 = calculate_bounding_box(network1)
    bbox2 = calculate_bounding_box(network2)
    def safe_division(numerator, denominator):
        return numerator / denominator if denominator != 0 else 1
    scale_x = safe_division(bbox2["max_x"] - bbox2["min_x"], bbox1["max_x"] - bbox1["min_x"])
    scale_y = safe_division(bbox2["max_y"] - bbox2["min_y"], bbox1["max_y"] - bbox1["min_y"])
    scale_z = safe_division(bbox2["max_z"] - bbox2["min_z"], bbox1["max_z"] - bbox1["min_z"])
    scale_factor = sum([1/scale_x,1/scale_y,1/scale_z])/3 * 100
    return scale_factor

def scale_network(network, scale_percent):
    num_nodes = len(network["nodes"])
    centroid = {"x": 0, "y": 0, "z": 0}
    centroid["x"], centroid["y"], centroid["z"] = get_centroid(network)
    scale_factor = scale_percent / 100.0
    for node in network["nodes"]:
        node["x"] = centroid["x"] + scale_factor * (node["x"] - centroid["x"])
        node["y"] = centroid["y"] + scale_factor * (node["y"] - centroid["y"])
        node["z"] = centroid["z"] + scale_factor * (node["z"] - centroid["z"])
    return network

def calculate_distance(node1, node2):
    return np.sqrt((node1['x'] - node2['x'])**2 + (node1['y'] - node2['y'])**2 + (node1['z'] - node2['z'])**2)

def reassign_ids(n1_nodes, n2_nodes):
    n1_len = len(n1_nodes)
    n2_len = len(n2_nodes)
    # Create the distance matrix
    distance_matrix = np.zeros((n1_len, n2_len))
    for i, n1_node in enumerate(n1_nodes):
        for j, n2_node in enumerate(n2_nodes):
            distance_matrix[i, j] = calculate_distance(n1_node, n2_node)
    # Use the Hungarian algorithm to find the optimal assignment
    row_ind, col_ind = linear_sum_assignment(distance_matrix)
    n1_id_mapping = {}
    n2_id_mapping = {}
    for i in range(len(row_ind)):
        n1_node = n1_nodes[row_ind[i]]
        n2_node = n2_nodes[col_ind[i]]
        new_id = f"node_{i}"
        n1_id_mapping[n1_node['id']] = new_id
        n2_id_mapping[n2_node['id']] = new_id
    return n1_id_mapping, n2_id_mapping

def update_ids(data, mapping):
    for node in data['nodes']:
        if node['id'] in mapping:
            node['id'] = mapping[node['id']]
    for edge in data.get('links', []):
        if edge['source'] in mapping:
            edge['source'] = mapping[edge['source']]
        if edge['target'] in mapping:
            edge['target'] = mapping[edge['target']]

def sort_data(data):
    def get_node_number(node):
        try:
            return int(node["id"].split("_")[1])
        except:
            return node["id"]
    sorted_nodes = sorted(data["nodes"], key=get_node_number)
    data["nodes"] = sorted_nodes
    return data

def match_networks(n1_data,n2_data):
    n1_id_mapping, n2_id_mapping = reassign_ids(n1_data['nodes'], n2_data['nodes'])
    update_ids(n1_data, n1_id_mapping)
    update_ids(n2_data, n2_id_mapping)
    n1_data = sort_data(n1_data)
    n2_data = sort_data(n2_data)
    return n1_data, n2_data

def clean_network(network):
    # Remove nodes with duplicated ids
    unique_nodes = {}
    for node in network["nodes"]:
        if node["id"] not in unique_nodes:
            unique_nodes[node["id"]] = node
    network["nodes"] = list(unique_nodes.values())
    node_ids = set(unique_nodes.keys())
    # Remove duplicate links and links to non-existent nodes
    unique_links = set()
    cleaned_links = []
    for link in network["links"]:
        linklist = sorted([link["source"], link["target"]])
        link_tuple = (linklist[0], linklist[1])
        if link_tuple not in unique_links and link["source"] in node_ids and link["target"] in node_ids:
            if link["source"] != link["target"]:
                unique_links.add(link_tuple)
                cleaned_links.append(link)
    network["links"] = cleaned_links
    return network


