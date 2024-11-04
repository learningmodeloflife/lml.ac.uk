import os
import shutil
import subprocess

shared_lib_dir_name = "shared_libs"

def remove_directory(directory_path):
    if os.path.exists(directory_path):
        shutil.rmtree(directory_path)
        print(f"_share_libs.py has removed '{directory_path}'")
    else:
        print(f"_share_libs.py thinks that '{directory_path}' does not exist.")

def copy_files(source, target):
    cmd = f"rsync -av --ignore-existing {source}/ {target}"
    print (cmd)
    subprocess.call(cmd, shell=True)

def replace_in_file(filepath, var1, var2):
    with open(filepath, 'r') as file:
        file_data = file.read()
    file_data = file_data.replace(var1, var2)
    with open(filepath, 'w') as file:
        file.write(file_data)
    print(f"_share_libs.py replaced:\n\tall instances of: '{var1}'\n\twith: '{var2}'\n\tin:'{filepath}'.\n")

output_dir = os.getenv("QUARTO_PROJECT_OUTPUT_DIR")
output_dir = os.path.relpath(output_dir)
print (f"****QUARTO OUTPUT DIR: {os.path.relpath(output_dir)} ***")
output_files = os.getenv("QUARTO_PROJECT_OUTPUT_FILES")
output_files_list = output_files.split('\n')
html_output = [x for x in output_files_list if x.endswith(".html")]
for htmlfile in html_output:
  auto_lib_dir_name = os.path.split(htmlfile)[-1].replace(".html","_files")
  auto_lib_dir = os.path.join(output_dir, auto_lib_dir_name)
  if os.path.isdir(auto_lib_dir):
    copy_files(auto_lib_dir, shared_lib_dir_name)
    remove_directory(auto_lib_dir)
    pass
  replace_in_file(htmlfile, auto_lib_dir_name, shared_lib_dir_name)
  speakerfile = htmlfile.replace(".html","-speaker.html")
  if os.path.exists(speakerfile):
    replace_in_file(speakerfile, auto_lib_dir_name, shared_lib_dir_name)


