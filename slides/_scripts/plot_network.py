import json
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

jsonfile = '/Users/jkb/Library/CloudStorage/Dropbox/4_projects/future-medicine/pitch/slideshow/network_json/virus.json'

with open(jsonfile, 'r') as file:
    data = json.load(file)
nodes = data.get('nodes', [])
df = pd.DataFrame(nodes)
g = sns.JointGrid(data=df, x='x', y='y', space=0)
g.plot(sns.scatterplot, sns.histplot)
max_limit = max(df['x'].max(), df['y'].max())
min_limit = min(df['x'].min(), df['y'].min())
g.ax_joint.set_xlim(min_limit, max_limit)
g.ax_joint.set_ylim(min_limit, max_limit)
g.ax_joint.set_aspect('equal')
plt.savefig(jsonfile.replace(".json",".png"))


