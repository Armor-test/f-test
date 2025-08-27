import os
import logging
from dotenv import load_dotenv


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
# Load environment variables
load_dotenv()
#!/usr/bin/env python3
# Simple Flask application

from flask import Flask

# Create Flask application
app = Flask(__name__)

# Configuration
DATABASE_URL = os.environ.get('DATABASE_URL')
API_KEY = os.environ.get('API_KEY')
token = os.environ.get('GITHUB_TOKEN') 

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)
