import json
import random
import numpy as np
import pandas as pd
from math import sqrt

outfile = '../network_json/sphere.json'

def fibonacci_sphere(samples=250, radius=1.0, center=(0, 0, 0), spikiness=0, flatten=(0,0,0) ):
    points = []
    phi = np.pi * (3. - np.sqrt(5.))  # golden angle in radians
    cx, cy, cz = center
    flatten_factors = [
        1 - (flatten[0] / 100.0),
        1 - (flatten[1] / 100.0),
        1 - (flatten[2] / 100.0),
        ]

    for i in range(samples):
        y = 1 - (i / float(samples - 1)) * 2  # y goes from 1 to -1
        radius_at_y = np.sqrt(1 - y * y)  # radius at y

        theta = phi * i  # golden angle increment

        x = np.cos(theta) * radius_at_y
        z = np.sin(theta) * radius_at_y

        points.append((
            x * radius * flatten_factors[0] + cx, 
            y * radius * flatten_factors[1] + cy, 
            z * radius * flatten_factors[2] + cz
            ))
    
    if spikiness > 0:
        spike_indices = random.sample(range(samples), int(samples/5))
        for idx in spike_indices:
            x, y, z = points[idx]
            direction = np.array([x - cx, y - cy, z - cz])
            distance = np.linalg.norm(direction)
            new_distance = distance + radius * (spikiness / 100)
            direction = direction / distance  # Normalize the direction vector
            points[idx] = tuple(np.array(center) + direction * new_distance)
            
            # Find the 5 nearest neighbors
            distances = []
            for i in range(samples):
                if i != idx:
                    dist = sqrt((points[i][0] - x) ** 2 + (points[i][1] - y) ** 2 + (points[i][2] - z) ** 2)
                    distances.append((i, dist))
            distances.sort(key=lambda x: x[1])
            nearest_neighbors = [i for i, d in distances[:5]]
            
            for neighbor_idx in nearest_neighbors:
                nx, ny, nz = points[neighbor_idx]
                direction = np.array([nx - cx, ny - cy, nz - cz])
                distance = np.linalg.norm(direction)
                new_distance = distance + radius * (spikiness / 200)
                direction = direction / distance  # Normalize the direction vector
                points[neighbor_idx] = tuple(np.array(center) + direction * new_distance)
    
    return points


def create_nodes_dict(points):
    nodes = []
    for i, (x, y, z) in enumerate(points):
        node = {
            "id": f"node_{i+1}",
            "x": x,
            "y": y,
            "z": z
        }
        nodes.append(node)
    
    graph_dict = {
        "nodes": nodes,
        "links": []
    }
    
    return graph_dict

def save_dict_to_json(data, filename=outfile):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

# Generate the points
points = []
points += fibonacci_sphere(247, 500, (-1500,0,3000), flatten=(0,70,0))
points += fibonacci_sphere(247, 500, (0,0,4500), spikiness=30)
points += fibonacci_sphere(247, 500, (1500,0,3000))

# Convert to pandas DataFrame for better visualization (optional)
df = pd.DataFrame(points, columns=['x', 'y', 'z'])

# Create the dictionary
graph_dict = create_nodes_dict(points)

# Save the dictionary to a JSON file
save_dict_to_json(graph_dict)

# Print the dictionary (optional, for local debugging)
print(json.dumps(graph_dict, indent=4))
