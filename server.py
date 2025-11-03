from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os

app = Flask(__name__, static_folder='.')
CORS(app)

GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwipkV06uuQpzTbikM3Lmz9XOVUvYhIbM3XmADOT1al6VQzkcJJ9EfHJ7yPyBw1mVz5UA/exec'

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/proxy', methods=['GET', 'POST'])
def proxy():
    try:
        if request.method == 'POST':
            data = request.get_json()
            
            response = requests.post(
                GOOGLE_SCRIPT_URL,
                json=data,
                headers={'Content-Type': 'application/json'},
                allow_redirects=True,
                timeout=30
            )
            
            try:
                return jsonify(response.json())
            except:
                return jsonify({'ok': False, 'error': 'Invalid response from Google Apps Script'})
                
        else:
            action = request.args.get('action', '')
            url = f"{GOOGLE_SCRIPT_URL}?action={action}"
            
            response = requests.get(url, allow_redirects=True, timeout=30)
            
            try:
                return jsonify(response.json())
            except:
                return jsonify({'ok': False, 'error': 'Invalid response from Google Apps Script'})
                
    except requests.exceptions.Timeout:
        return jsonify({'ok': False, 'error': 'Request timeout'}), 408
    except requests.exceptions.RequestException as e:
        return jsonify({'ok': False, 'error': f'Network error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'ok': False, 'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
