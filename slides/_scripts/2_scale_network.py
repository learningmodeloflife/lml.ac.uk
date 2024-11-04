from wireframe_functions import *

jsonfile = '../network_json/crop.json'
scale_percent = 200

data = load_data(jsonfile)
data = scale_network(data, scale_percent)
save_data(jsonfile, data)




