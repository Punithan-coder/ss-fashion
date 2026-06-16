import json
import os
import uuid
import datetime
from pathlib import Path
from flask import Flask, jsonify, request

app = Flask(__name__)

DATA_DIR = Path(__file__).resolve().parent / 'data'
DATA_DIR.mkdir(parents=True, exist_ok=True)
DATA_FILE = DATA_DIR / 'products.json'
if not DATA_FILE.exists():
    DATA_FILE.write_text('[]', encoding='utf-8')


def load_products():
    try:
        return json.loads(DATA_FILE.read_text(encoding='utf-8'))
    except json.JSONDecodeError:
        return []


def save_products(products):
    DATA_FILE.write_text(json.dumps(products, indent=2, ensure_ascii=False), encoding='utf-8')


def parse_active(value):
    if isinstance(value, str):
        return value.strip().lower() in ('true', '1', 'yes', 'on')
    return bool(value)


def normalize_images(value):
    if isinstance(value, list):
        return [str(image).strip() for image in value if str(image).strip()][:10]
    if isinstance(value, str) and value.strip():
        return [value.strip()]
    return []


def validate_product(data):
    errors = []
    name = str(data.get('name', '')).strip()
    if not name:
        errors.append('Product name is required.')

    price_value = data.get('price', 0)
    try:
        price = float(price_value)
        if price < 0:
            raise ValueError()
    except (TypeError, ValueError):
        errors.append('Price must be a valid positive number.')
        price = 0.0

    category = str(data.get('category', '')).strip()
    if not category:
        errors.append('Category is required.')

    images = normalize_images(data.get('images'))
    if not images:
        errors.append('At least one product image is required.')

    stock_value = data.get('stock', 0)
    try:
        stock = int(stock_value)
        if stock < 0:
            stock = 0
    except (TypeError, ValueError):
        stock = 0

    shipping_value = data.get('shippingCost', 0)
    try:
        shippingCost = float(shipping_value)
        if shippingCost < 0:
            shippingCost = 0.0
    except (TypeError, ValueError):
        shippingCost = 0.0

    active = parse_active(data.get('active', True))

    return errors, {
        'name': name,
        'price': price,
        'category': category,
        'description': str(data.get('description', '')).strip(),
        'stock': stock,
        'shippingCost': shippingCost,
        'active': active,
        'images': images,
        'image': images[0] if images else str(data.get('image', '')).strip(),
    }


@app.route('/api/hello')
def hello():
    return jsonify(message='Hello from ss-fassion Python backend!')


@app.route('/')
def root():
    return jsonify(status='ss-fassion backend is running')


@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json() or {}

    username = data.get('username')
    password = data.get('password')

    if username == 'admin' and password == 'admin123':
        return jsonify({
            'token': 'ssfashion-admin-token',
            'message': 'Login successful'
        })

    return jsonify({
        'message': 'Invalid login credentials'
    }), 401


@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products=load_products())


@app.route('/api/products', methods=['POST'])
def create_product():
    payload = request.get_json(force=True, silent=True) or {}
    errors, normalized = validate_product(payload)
    if errors:
        return jsonify(message=' '.join(errors)), 400

    products = load_products()
    product = {
        'id': str(uuid.uuid4()),
        **normalized,
        'addedAt': datetime.date.today().isoformat(),
    }
    products.append(product)
    save_products(products)
    return jsonify(product=product), 201


@app.route('/api/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    payload = request.get_json(force=True, silent=True) or {}
    errors, normalized = validate_product(payload)
    if errors:
        return jsonify(message=' '.join(errors)), 400

    products = load_products()
    for index, product in enumerate(products):
        if product.get('id') == product_id:
            updated = {
                'id': product_id,
                **normalized,
                'addedAt': product.get('addedAt', datetime.date.today().isoformat()),
            }
            products[index] = updated
            save_products(products)
            return jsonify(product=updated)

    return jsonify(message='Product not found.'), 404


@app.route('/api/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    products = load_products()
    updated_products = [product for product in products if product.get('id') != product_id]
    if len(updated_products) == len(products):
        return jsonify(message='Product not found.'), 404

    save_products(updated_products)
    return jsonify(message='Product deleted.')


@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    products = load_products()
    for product in products:
        if product.get('id') == product_id:
            return jsonify(product=product)
    return jsonify(message='Product not found.'), 404


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
