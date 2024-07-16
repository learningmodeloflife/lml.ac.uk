import os
import re

def update_img_src(yaml_content, filename_without_ext):
    img_src_pattern = re.compile(r'img_src\s*:\s*.+', re.MULTILINE)
    new_img_src = f'img_src: /img/people/{filename_without_ext}.jpg'

    print (filename_without_ext, new_img_src)

    # If img_src is found, replace it, else add the new img_src
    if re.search(img_src_pattern, yaml_content):
        modified_yaml = re.sub(img_src_pattern, new_img_src, yaml_content)
    else:
        modified_yaml = yaml_content.rstrip() + '\n' + new_img_src + '\n'
    
    return modified_yaml

def process_md_file(filepath):
    with open(filepath, 'r') as file:
        content = file.read()

    match = re.search(r'--- *\n(.*?)--- *\n', content, re.DOTALL)
    
    if match:
        filename_without_ext = os.path.splitext(os.path.basename(filepath))[0]
        modified_yaml = update_img_src(match.group(1), filename_without_ext)
        # Replace the old YAML content with the modified one
        content = content.replace(match.group(1), modified_yaml, 1)
        
        with open(filepath, 'w') as file:
            file.write(content)

for file in os.listdir("./"):
    if file.endswith('.md'):
        process_md_file(file)



