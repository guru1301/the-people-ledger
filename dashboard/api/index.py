import sys
import os

# Add parent directory to sys.path to import server.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server import app
