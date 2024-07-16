import subprocess

cmd = "mogrify -resize 350x350^ -gravity center -extent 350x350 *.jpg"
print(cmd)
subprocess.call(cmd, shell=True)


