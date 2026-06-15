import json
import os
import uuid
from datetime import datetime
from functools import wraps
from flask import Flask, jsonify, request, abort

app = Flask(__name__)
BASE_DIR = os.path.dirname(__file__)
PRODUCT_FILE = os.path.join(BASE_DIR, 'products.json')
ADMIN_USERNAME = 'ssadmin'
ADMIN_PASSWORD = 'ss1989'
ADMIN_TOKEN = 'ssfashion-admin-token'


def load_products():
    if not os.path.exists(PRODUCT_FILE):
        return []
    try:
        with open(PRODUCT_FILE, 'r', encoding='utf-8') as file:
            return json.load(file)
    except Exception:
        return []


def save_products(products):
    with open(PRODUCT_FILE, 'w', encoding='utf-8') as file:
        json.dump(products, file, indent=2, ensure_ascii=False)


def admin_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if auth_header != f'Bearer {ADMIN_TOKEN}':
            return jsonify(message='Unauthorized'), 401
        return func(*args, **kwargs)
    return wrapper


@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
    return response


@app.route('/api/products', methods=['GET'])
def get_products():
    products = load_products()
    return jsonify(products=products)


@app.route('/api/products', methods=['POST'])
@admin_required
def add_product():
    data = request.get_json() or {}
    images = data.get('images') or ([] if data.get('image') else [])
    if isinstance(images, str) and images:
        images = [images]
    images = [str(img).strip() for img in images if str(img).strip()]
    featured_image = str(data.get('image', '')).strip() or (images[0] if images else '')

    required_fields = ['name', 'price', 'category']
    if not all(data.get(field) for field in required_fields) or not featured_image:
        return jsonify(message='Missing required product fields'), 400

    products = load_products()
    new_product = {
        'id': uuid.uuid4().hex,
        'name': data['name'],
        'price': int(data.get('price', 0)),
        'category': data['category'],
        'image': featured_image,
        'images': images or [featured_image],
        'description': data.get('description', ''),
        'stock': int(data.get('stock', 0)),
        'shippingCost': float(data.get('shippingCost', 0.0)),
        'active': bool(data.get('active', True)),
        'addedAt': datetime.utcnow().isoformat() + 'Z',
    }
    products.append(new_product)
    save_products(products)
    return jsonify(product=new_product), 201


@app.route('/api/products/<product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    data = request.get_json() or {}
    images = data.get('images')
    if isinstance(images, str) and images:
        images = [images]
    if images is not None:
        images = [str(img).strip() for img in images if str(img).strip()]

    products = load_products()
    index = next((i for i, product in enumerate(products) if product['id'] == product_id), None)
    if index is None:
        return jsonify(message='Product not found'), 404

    product = products[index]
    featured_image = str(data.get('image', product.get('image', ''))).strip()
    if images:
        featured_image = images[0]

    product.update({
        'name': data.get('name', product['name']),
        'price': int(data.get('price', product['price'])),
        'category': data.get('category', product['category']),
        'image': featured_image,
        'images': images if images is not None else product.get('images', [product.get('image')]),
        'description': data.get('description', product.get('description', '')),
        'stock': int(data.get('stock', product.get('stock', 0))),
        'shippingCost': float(data.get('shippingCost', product.get('shippingCost', 0.0))),
        'active': bool(data.get('active', product.get('active', True))),
    })
    products[index] = product
    save_products(products)
    return jsonify(product=product)


@app.route('/api/products/<product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    products = load_products()
    remaining = [product for product in products if product['id'] != product_id]
    if len(remaining) == len(products):
        return jsonify(message='Product not found'), 404
    save_products(remaining)
    return jsonify(message='Product deleted')


@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    products = load_products()
    product = next((product for product in products if product['id'] == product_id), None)
    if not product:
        return jsonify(message='Product not found'), 404
    return jsonify(product=product)


@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        return jsonify(token=ADMIN_TOKEN)
    return jsonify(message='Invalid credentials'), 401


@app.route('/')
def root():
    return jsonify(status='ss-fassion backend is running')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
