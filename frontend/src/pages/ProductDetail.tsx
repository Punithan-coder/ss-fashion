import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Crown, Heart, ShoppingBag, ZoomIn } from 'lucide-react';
import { products as fallbackProducts } from '../data/products';
import { useCart, Product } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { ProductCard } from '../components/ProductCard';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [expandedDetails, setExpandedDetails] = useState(false);
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => {
        const allProducts: Product[] = data?.products || fallbackProducts;
        setProducts(allProducts);
        const match = allProducts.find((item) => item.id === id) || fallbackProducts.find((item) => item.id === id) || null;
        if (match) {
          setProduct(match);
          setFetchError('');
        } else {
          setProduct(null);
          setFetchError('Product not found.');
        }
      })
      .catch(() => {
        setProducts(fallbackProducts);
        const fallback = fallbackProducts.find((item) => item.id === id) || null;
        setProduct(fallback);
        setFetchError('Unable to load live product details. Showing fallback data.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setSelectedSize(product?.sizes?.[0] || '');
    setActiveImage(0);
  }, [product]);

  if (loading) {
    return (
      <div className="page min-h-screen bg-luxury-cream py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-rose-600 mb-4">Loading product</p>
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-600">...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page min-h-screen bg-luxury-cream py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-rose-600 mb-4">Product not found</p>
          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-6">We couldn\'t locate that product.</h1>
          <Link to="/shop" className="btn-luxury inline-flex items-center justify-center px-8 py-4">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];
  const inCart = cartItems.some((item) => item.id === product.id);
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);

  const handleCart = () => {
    if (!inCart) {
      addToCart(product);
    }
  };

  return (
    <div className="page bg-luxury-cream pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-900">
              <ArrowLeft size={18} /> Back to Shop
            </Link>
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500 mt-4">{product.category}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm text-rose-700">
              <Heart size={16} /> Premium selection
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm text-stone-700 border border-rose-100">
              <Crown size={16} /> Luxury collection
            </span>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-none shadow-2xl bg-luxury-cream group">
              <img
                src={gallery[activeImage]}
                alt={product.name}
                className="w-full h-[400px] sm:h-[450px] object-contain bg-stone-50 rounded-3xl transition-transform duration-700 ease-out hover:scale-105 cursor-zoom-in"
                onClick={() => setShowZoom(true)}
              />
              <button
                type="button"
                onClick={() => setShowZoom(true)}
                className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-5 py-2.5 text-sm font-bold text-luxury-charcoal shadow-md hover:bg-white hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100"
              >
                <ZoomIn size={16} /> Zoom
              </button>
              <div className="absolute inset-y-1/2 left-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={() => setActiveImage((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))}
                  className="rounded-full bg-white/90 p-3 shadow-lg hover:bg-white hover:scale-110 transition-all text-luxury-charcoal"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>
              <div className="absolute inset-y-1/2 right-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  type="button"
                  onClick={() => setActiveImage((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))}
                  className="rounded-full bg-white/90 p-3 shadow-lg hover:bg-white hover:scale-110 transition-all text-luxury-charcoal"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {gallery.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`shrink-0 relative overflow-hidden h-28 w-24 transition-all duration-300 ${
                      index === activeImage 
                        ? 'ring-2 ring-luxury-champagne ring-offset-2 opacity-100 scale-105' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[0.95fr_0.9fr]">
              <div className="rounded-[32px] bg-white p-8 shadow-lg border border-rose-100">
                <h2 className="text-2xl font-semibold text-stone-900 mb-4">Product Details</h2>
                <p className="text-stone-600 leading-relaxed">{product.description}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-rose-600 mb-2">Fabric</p>
                    <p className="text-stone-700">{product.fabric}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-rose-600 mb-2">Delivery</p>
                    <p className="text-stone-700">{product.delivery}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-rose-600 mb-2">Stitching</p>
                    <p className="text-stone-700">{product.stitchInfo}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-rose-600 mb-2">Availability</p>
                    <p className="text-stone-700">{product.availability}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[32px] bg-white p-8 shadow-lg border border-rose-100">
                <h2 className="text-2xl font-semibold text-stone-900 mb-4">Measurements & Care</h2>
                <p className="text-stone-600 leading-relaxed mb-4">Select your preferred fit and add a personal tailoring request to make this piece your own.</p>
                <ul className="space-y-4 text-stone-700">
                  <li className="rounded-3xl bg-rose-50 p-4">Soft lining for refined comfort</li>
                  <li className="rounded-3xl bg-rose-50 p-4">Customizable neckline and hem finish</li>
                  <li className="rounded-3xl bg-rose-50 p-4">Detailed care instructions included</li>
                </ul>
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="rounded-[32px] bg-white p-8 shadow-xl border border-rose-100">
              <p className="text-sm uppercase tracking-[0.35em] text-rose-600 mb-3">Signature Style</p>
              <h1 className="text-4xl font-serif font-bold text-stone-900 mb-4">{product.name}</h1>
              <p className="text-3xl font-semibold text-stone-900 mb-4">{formatPrice(product.price)}</p>
              <p className="text-sm text-stone-500 mb-6">{product.category} • {product.stock && product.stock > 0 ? 'In stock' : 'Out of stock'}</p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-rose-600 mb-2">Size</p>
                  <div className="grid grid-cols-3 gap-3">
                    {product.sizes?.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-3xl border px-4 py-3 text-sm font-semibold transition ${selectedSize === size ? 'border-rose-500 bg-rose-50 text-stone-900' : 'border-rose-100 bg-white text-stone-600 hover:border-rose-300'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] bg-rose-50 p-4 text-sm text-stone-600">
                  <p className="font-semibold text-stone-900 mb-2">Delivery</p>
                  <p>{product.delivery}</p>
                </div>
              </div>

              <button
                onClick={handleCart}
                disabled={product.stock === 0}
                className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-full font-bold uppercase tracking-[0.15em] text-white shadow-[0_8px_20px_rgba(216,155,181,0.4)] transition-all duration-500 hover:shadow-[0_12px_28px_rgba(216,155,181,0.5)] hover:-translate-y-1 bg-gradient-to-r from-luxury-rosePink via-luxury-champagne to-luxury-rosePink bg-[length:200%_auto] hover:bg-right ${product.stock === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <ShoppingBag size={20} />
                {inCart ? 'In Cart' : 'Add to Cart'}
              </button>

              <div className="mt-6 text-center text-xs uppercase tracking-widest text-luxury-stone font-semibold">
                <p>{product.shippingCost ? `Shipping: ${formatPrice(product.shippingCost)}` : 'Complimentary Shipping on all orders'}</p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-24 pt-16 border-t border-luxury-rosePink/20">
          <div className="flex flex-col items-center text-center mb-12">
            <p className="text-sm uppercase tracking-[0.3em] text-luxury-rosePink font-bold mb-3">You may also like</p>
            <h2 className="text-4xl font-serif font-bold text-luxury-charcoal">Related Pieces</h2>
            <div className="h-px w-16 bg-luxury-champagne mt-6"></div>
          </div>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {related.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </div>

      {showZoom && (
        <div className="fixed inset-0 z-50 bg-black/80 p-4 flex items-center justify-center" onClick={() => setShowZoom(false)}>
          <img
            src={gallery[activeImage]}
            alt={product.name}
            className="max-h-full max-w-full rounded-[32px] object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
