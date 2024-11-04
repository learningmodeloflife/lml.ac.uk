import re
import json
import numpy as np
import subprocess
from math import sqrt
import svgwrite
from svgwrite import Drawing, rgb
from svgwrite.path import Path
import svgpathtools
from svgpathtools import svg2paths
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

svg_file_path = '../json/crop.svg' 
precision_percentage = 0.013  # 1% for example. Titrate this to get the right number of nodes saved. 
flipvertical = False
fliphorizontal = False

if flipvertical:
    #flippedfile = svg_file_path.replace(".svg","_v.svg")
    flippedfile = svg_file_path
    cmd = 'inkscape {} --export-filename={} --actions="select-all;object-flip-vertical"'.format(svg_file_path, flippedfile)
    subprocess.call(cmd, shell=True)
    svg_file_path = flippedfile

if fliphorizontal:
    #flippedfile = svg_file_path.replace(".svg","_h.svg")
    flippedfile = svg_file_path
    cmd = 'inkscape {} --export-filename={} --actions="select-all;object-flip-horizontal"'.format(svg_file_path, flippedfile)
    subprocess.call(cmd, shell=True)
    svg_file_path = flippedfile

def apply_transform(point, transform):
    x, y = point
    if transform.shape == (3, 3):  # 3x3 transformation matrix
        new_x = transform[0, 0] * x + transform[0, 1] * y + transform[0, 2]
        new_y = transform[1, 0] * x + transform[1, 1] * y + transform[1, 2]
    else:
        raise ValueError("Unsupported transform type")
    return new_x, new_y

def get_start_end_coords(paths, attributes):
    coords = []
    for i, path in enumerate(paths):
        transform_str = attributes[i].get('transform', None)
        transform_matrix = svgpathtools.parser.parse_transform(transform_str) if transform_str else np.eye(3)
        
        for j, segment in enumerate(path):
            path_id = attributes[i].get('id', f"path_{i}_{j}")
            start_point = (segment.start.real, segment.start.imag)
            end_point = (segment.end.real, segment.end.imag)
            
            # Apply the transformation to the start and end points
            start_point = apply_transform(start_point, transform_matrix)
            end_point = apply_transform(end_point, transform_matrix)
            
            coords.append((start_point, end_point, path_id))
    
    return coords

def round_to_precision(value, precision):
    return np.floor(value / precision) * precision

# Group coordinates that occupy the same position within the precision
def group_coordinates(coords, x_precision, y_precision):
    grouped_coords = {}
    for coord in coords:
        rounded_start_x = round_to_precision(coord[0][0], x_precision)
        rounded_start_y = round_to_precision(coord[0][1], y_precision)
        rounded_end_x = round_to_precision(coord[1][0], x_precision)
        rounded_end_y = round_to_precision(coord[1][1], y_precision)
        start_key = (rounded_start_x, rounded_start_y)
        end_key = (rounded_end_x, rounded_end_y)
        if start_key not in grouped_coords:
            grouped_coords[start_key] = (rounded_start_x, rounded_start_y)
        if end_key not in grouped_coords:
            grouped_coords[end_key] = (rounded_end_x, rounded_end_y)
    return grouped_coords

# Load JSON data
def load_json(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

# Save JSON data
def save_json(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

# reverse translate the new json back into svg
def create_svg_from_d3_network(data, svg_file):
    # Calculate the bounding box of the network
    min_x = min(node['x'] for node in data['nodes'])
    max_x = max(node['x'] for node in data['nodes'])
    min_y = min(node['y'] for node in data['nodes'])
    max_y = max(node['y'] for node in data['nodes'])
    
    # Add some padding to the bounding box
    padding = 100
    width = max_x - min_x + 2 * padding
    height = max_y - min_y + 2 * padding
    # Translate all coordinates to ensure all elements fit within the SVG canvas
    translate_x = -min_x + padding
    translate_y = -min_y + padding
    
    # Create the SVG drawing with the calculated size
    dwg = Drawing(svg_file, size=(f'{width}px', f'{height}px'), profile='full')
    nodes = {node['id']: node for node in data['nodes']}
    for index, link in enumerate(data['links']):
        source = nodes[link['source']]
        target = nodes[link['target']]
        path = Path(stroke=rgb(10, 10, 16, '%'), id=f'path_{index}')
        path.push(f'M {source["x"] + translate_x},{source["y"] + translate_y}')
        path.push(f'L {target["x"] + translate_x},{target["y"] + translate_y}')
        dwg.add(path)
    dwg.save()

# READ COORDINATES FROM SVG
paths, attributes = svg2paths(svg_file_path)
coords = get_start_end_coords(paths, attributes)
print (f"{len(paths)} paths found")
print (f"{len(coords)} coords found")
x_coords = [c[0][0] for c in coords] + [c[1][0] for c in coords]
y_coords = [c[0][1] for c in coords] + [c[1][1] for c in coords]
min_x, max_x = min(x_coords), max(x_coords)
min_y, max_y = min(y_coords), max(y_coords)
width = max_x - min_x
height = max_y - min_y
print(f"Image dimensions: width={width}, height={height}")

# SAVE A PNG SHOWING THE NODES
df = pd.DataFrame({"x":x_coords, "y":y_coords})
g = sns.JointGrid(data=df, x='x', y='y', space=0)
g.plot(sns.scatterplot, sns.histplot)
max_limit = max(df['x'].max(), df['y'].max())
min_limit = min(df['x'].min(), df['y'].min())
g.ax_joint.set_xlim(min_limit, max_limit)
g.ax_joint.set_ylim(min_limit, max_limit)
g.ax_joint.set_aspect('equal')
plt.savefig(svg_file_path.replace(".svg",".png"))

'''
reverse_svg = svg_file_path.replace(".svg","_reversetranslate.svg")
d3_network_data = load_json(output_json_path)
create_svg_from_d3_network(d3_network_data, reverse_svg)
add_property_to_nodes(output_json_path, output_json_path)
'''

# Replace original coordinates with grouped ones and remove duplicates
x_precision = width * precision_percentage
y_precision = height * precision_percentage
grouped_coords = group_coordinates(coords, x_precision, y_precision)
unique_paths = set()
adjusted_paths = []
for start, end, path_id in coords:
    rounded_start = grouped_coords[(round_to_precision(start[0], x_precision), round_to_precision(start[1], y_precision))]
    rounded_end = grouped_coords[(round_to_precision(end[0], x_precision), round_to_precision(end[1], y_precision))]
    if (rounded_start, rounded_end) not in unique_paths and (rounded_end, rounded_start) not in unique_paths:
        unique_paths.add((rounded_start, rounded_end))
        adjusted_paths.append((rounded_start, rounded_end, path_id))
print (f"{len(adjusted_paths)} adjusted_paths found")


# Create nodes and links for JSON
node_map = {}
nodes = []
links = []
for start, end, path_id in adjusted_paths:
    if start not in node_map:
        node_map[start] = f"{path_id}_start"
        nodes.append({"id": node_map[start], "x": start[0], "y": start[1], "z": 0})
    if end not in node_map:
        node_map[end] = f"{path_id}_end"
        nodes.append({"id": node_map[end], "x": end[0], "y": end[1], "z": 0})
    links.append({"source": node_map[start], "target": node_map[end]})
data = {"nodes":nodes, "links":links}
print (f"{len(data['nodes'])} nodes saved")
save_json(data, svg_file_path.replace(".svg", ".json"))



