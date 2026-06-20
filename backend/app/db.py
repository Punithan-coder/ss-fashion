import os
import re
import json
import uuid
import base64
from io import BytesIO
from datetime import datetime
from PIL import Image
from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database Setup
DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    # Use SQLite by default
    DATABASE_URL = 'sqlite:///products.db'
elif DATABASE_URL.startswith("postgres://"):
    # Fix Heroku/Render Postgres URL compatibility
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ProductModel(Base):
    __tablename__ = 'products'

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    price = Column(Integer, nullable=False)
    category = Column(String(100), nullable=False)
    image = Column(Text, nullable=False)  # Primary featured image URL/path
    images = Column(Text, nullable=True)  # JSON-serialized list of image URLs/paths
    description = Column(Text, nullable=True)
    stock = Column(Integer, default=0)
    shippingCost = Column(Float, default=0.0)
    active = Column(Boolean, default=True)
    addedAt = Column(String(50), nullable=False)

    def to_dict(self):
        # Safely parse images
        try:
            images_list = json.loads(self.images) if self.images else [self.image]
        except Exception:
            images_list = [self.image]

        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'category': self.category,
            'image': self.image,
            'images': images_list,
            'description': self.description or '',
            'stock': self.stock,
            'shippingCost': self.shippingCost,
            'active': self.active,
            'addedAt': self.addedAt
        }

def init_db(products_json_path=None):
    Base.metadata.create_all(bind=engine)
    
    # If the database is empty and products_json_path exists, populate it
    db = SessionLocal()
    try:
        count = db.query(ProductModel).count()
        if count == 0 and products_json_path and os.path.exists(products_json_path):
            with open(products_json_path, 'r', encoding='utf-8') as f:
                products = json.load(f)
                for p in products:
                    # Map the fields
                    images_val = json.dumps(p.get('images', [p.get('image', '')]))
                    db_product = ProductModel(
                        id=p.get('id', uuid.uuid4().hex),
                        name=p.get('name', ''),
                        price=int(p.get('price', 0)),
                        category=p.get('category', ''),
                        image=p.get('image', ''),
                        images=images_val,
                        description=p.get('description', ''),
                        stock=int(p.get('stock', 0)),
                        shippingCost=float(p.get('shippingCost', 0.0)),
                        active=bool(p.get('active', True)),
                        addedAt=p.get('addedAt', datetime.utcnow().isoformat() + 'Z')
                    )
                    db.add(db_product)
                db.commit()
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

def compress_and_save_image(base64_str, upload_dir):
    """
    Decodes a base64 image string, compresses it using Pillow,
    saves it to upload_dir as an optimized WebP, and returns the relative path.
    If it's already a URL/path, returns it unchanged.
    """
    if not base64_str:
        return ""
        
    # Check if this is indeed a base64 string
    if not base64_str.startswith('data:'):
        return base64_str
        
    try:
        # Extract base64 header and bytes
        match = re.match(r'^data:[^;]+;base64,', base64_str)
        if not match:
            return base64_str
            
        header = match.group(0)
        base64_data = base64_str[len(header):]
        image_bytes = base64.b64decode(base64_data)
        
        # Load in Pillow
        img = Image.open(BytesIO(image_bytes))
        
        # Ensure upload folder exists
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate clean filename and save as WebP
        filename = f"{uuid.uuid4().hex}.webp"
        filepath = os.path.join(upload_dir, filename)
        
        # Save as compressed WebP (quality=75 is standard compression)
        img.save(filepath, 'WEBP', quality=75)
        
        return f"/uploads/{filename}"
    except Exception as e:
        print(f"Error processing base64 image: {e}")
        return base64_str
