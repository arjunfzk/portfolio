#!/usr/bin/env python3
"""
Simple HTTP server for local development with SPA routing support.
Serves 404.html for non-existent paths to enable client-side routing.

Usage:
    python3 server.py [port]

Default port: 8080
"""

import http.server
import socketserver
import sys
from pathlib import Path

class SPAHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler that serves 404.html for missing files."""
    
    def do_GET(self):
        # Get the path
        path = self.translate_path(self.path)
        
        # If the file doesn't exist and it's not a request for a file with an extension
        if not Path(path).exists():
            # Check if it looks like a route (no file extension)
            if '.' not in Path(self.path).name:
                # Serve 404.html which will handle the redirect
                self.path = '/404.html'
        
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

def run_server(port=8080):
    """Start the development server."""
    Handler = SPAHTTPRequestHandler
    
    with socketserver.TCPServer(("", port), Handler) as httpd:
        print(f"Server running at http://localhost:{port}/")
        print("Press Ctrl+C to stop")
        print("\nTest personalized URLs:")
        print(f"  http://localhost:{port}/john_google")
        print(f"  http://localhost:{port}/sarah_microsoft")
        print("")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped.")

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    run_server(port)

