#!/usr/bin/env python3
# Simple Flask application

from flask import Flask

# Create Flask application
app = Flask(__name__)

# Configuration
DATABASE_URL = "postgres://user:password123@localhost:5432/db"
API_KEY = "sk_test_abcdefghijklmnopqrstuvwxyz123456"
token = "ghp_1asdjk1jakds_21jdas" 

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)
