import json
import random

def create_hierarchical_graph(num_nodes_level0, num_nodes_level1, num_nodes_level2, num_nodes_level3, num_modules):
    nodes = []
    links = []
    
    modules = [f"module_{i}" for i in range(num_modules)]
    
    # Create nodes for each level with assigned positions
    y_offset = 100
    z_offset = 100
    size_scale = 2  # Increase the size of the nodes
    
    def create_nodes(level, num_nodes):
        return [
            {
                "id": f"node{level}_{i}",
                "path": f"node{level}_{i}",
                "size": random.randint(20, 60) * size_scale,
                "level": level,
                "module": random.choice(modules),
                "x": level * 100,
                "y": y_offset * (i % 10),
                "z": z_offset * (i // 10)
            }
            for i in range(num_nodes)
        ]
    
    nodes.extend(create_nodes(0, num_nodes_level0))
    nodes.extend(create_nodes(1, num_nodes_level1))
    nodes.extend(create_nodes(2, num_nodes_level2))
    nodes.extend(create_nodes(3, num_nodes_level3))

    # Create links ensuring DAG structure
    def create_links(source_level, target_level, num_nodes_source, num_nodes_target):
        for i in range(num_nodes_source):
            source = f"node{source_level}_{i}"
            target = f"node{target_level}_{random.randint(0, num_nodes_target - 1)}"
            links.append({"source": source, "target": target})
    
    create_links(0, 1, num_nodes_level0, num_nodes_level1)
    create_links(1, 2, num_nodes_level1, num_nodes_level2)
    create_links(2, 3, num_nodes_level2, num_nodes_level3)

    return {"nodes": nodes, "links": links}

# Create a hierarchical graph with the required structure
hierarchical_graph = create_hierarchical_graph(14, 80, 40, 25, 5)

# Save to a JSON file
hierarchical_graph_file_path = "../network_json/hierarchical_graph.json"
with open(hierarchical_graph_file_path, 'w') as file:
    json.dump(hierarchical_graph, file, indent=4)

