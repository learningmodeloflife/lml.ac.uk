from wireframe_functions import *

'''
Remove any duplicate links, or any links to nodes that don't exist. 
Remove nodes with duplicated ids. 
Then save the network to a json file in the same format
'''

input_filename = "../json/virus.json"  # Replace with your input file name
output_filename = input_filename
center = [0,0,0]

data = load_data(input_filename)
data = clean_network(data)
data = centre_network(data, center)
save_data(output_filename, data)

