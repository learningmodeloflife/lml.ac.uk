'''
This script needs to be copied into the top level directory of the web site
'''

import http.server
import socketserver 
with socketserver.TCPServer(("", 8000), http.server.SimpleHTTPRequestHandler) as httpd:
	httpd.serve_forever()
