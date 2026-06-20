import json
import os
import uuid
from datetime import datetime
from functools import wraps
from flask import Flask, jsonify, request, abort, send_from_directory
from flask_cors import CORS

# Import from db.py
try:
    from db import SessionLocal, ProductModel, init_db, compress_and_save_image
except ImportError:
    from app.db import SessionLocal, ProductModel, init_db, compress_and_save_image

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)
ADMIN_USERNAME = 'ssadmin'
ADMIN_PASSWORD = 'ss1989'
ADMIN_TOKEN = 'ssfashion-admin-token'

# Initialize database on startup, using current products.json as seed data
init_db(os.path.join(BASE_DIR, 'products.json'))


def admin_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        if auth_header != f'Bearer {ADMIN_TOKEN}':
            return jsonify(message='Unauthorized'), 401
        return func(*args, **kwargs)
    return wrapper


@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    return send_from_directory(os.path.join(os.path.dirname(__file__), 'uploads'), filename)


@app.route('/api/products', methods=['GET'])
def get_products():
    db = SessionLocal()
    try:
        products = db.query(ProductModel).all()
        return jsonify(products=[p.to_dict() for p in products])
    finally:
        db.close()


@app.route('/api/products', methods=['POST'])
@admin_required
def add_product():
    data = request.get_json() or {}
    images = data.get('images') or ([] if data.get('image') else [])
    if isinstance(images, str) and images:
        images = [images]
    images = [str(img).strip() for img in images if str(img).strip()]

    required_fields = ['name', 'price', 'category']
    if not all(data.get(field) for field in required_fields) or not images:
        return jsonify(message='Missing required product fields'), 400

    # Compress and save base64 images to static uploads
    upload_dir = os.path.join(os.path.dirname(__file__), 'uploads')
    processed_images = [compress_and_save_image(img, upload_dir) for img in images]
    featured_image = processed_images[0] if processed_images else ""

    db = SessionLocal()
    try:
        new_product = ProductModel(
            id=uuid.uuid4().hex,
            name=data['name'],
            price=int(data.get('price', 0)),
            category=data['category'],
            image=featured_image,
            images=json.dumps(processed_images),
            description=data.get('description', ''),
            stock=int(data.get('stock', 0)),
            shippingCost=float(data.get('shippingCost', 0.0)),
            active=bool(data.get('active', True)),
            addedAt=datetime.utcnow().isoformat() + 'Z'
        )
        db.add(new_product)
        db.commit()
        product_dict = new_product.to_dict()
        return jsonify(product=product_dict), 201
    except Exception as e:
        db.rollback()
        return jsonify(message=f"Database error: {str(e)}"), 500
    finally:
        db.close()


@app.route('/api/products/<product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    data = request.get_json() or {}
    db = SessionLocal()
    try:
        product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if not product:
            return jsonify(message='Product not found'), 404

        images = data.get('images')
        if isinstance(images, str) and images:
            images = [images]
        if images is not None:
            images = [str(img).strip() for img in images if str(img).strip()]
            
            # Compress and save new base64 images
            upload_dir = os.path.join(os.path.dirname(__file__), 'uploads')
            processed_images = [compress_and_save_image(img, upload_dir) for img in images]
            product.images = json.dumps(processed_images)
            product.image = processed_images[0] if processed_images else product.image

        if 'name' in data:
            product.name = data['name']
        if 'price' in data:
            product.price = int(data['price'])
        if 'category' in data:
            product.category = data['category']
        if 'description' in data:
            product.description = data['description']
        if 'stock' in data:
            product.stock = int(data['stock'])
        if 'shippingCost' in data:
            product.shippingCost = float(data['shippingCost'])
        if 'active' in data:
            product.active = bool(data['active'])

        db.commit()
        product_dict = product.to_dict()
        return jsonify(product=product_dict)
    except Exception as e:
        db.rollback()
        return jsonify(message=f"Database error: {str(e)}"), 500
    finally:
        db.close()


@app.route('/api/products/<product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    db = SessionLocal()
    try:
        product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if not product:
            return jsonify(message='Product not found'), 404
        db.delete(product)
        db.commit()
        return jsonify(message='Product deleted')
    except Exception as e:
        db.rollback()
        return jsonify(message=f"Database error: {str(e)}"), 500
    finally:
        db.close()


@app.route('/api/products/<product_id>', methods=['GET'])
def get_product(product_id):
    db = SessionLocal()
    try:
        product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
        if not product:
            return jsonify(message='Product not found'), 404
        return jsonify(product=product.to_dict())
    finally:
        db.close()


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
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
