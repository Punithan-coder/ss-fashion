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
            <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
              {/* Vertical / Horizontal Thumbnail Gallery */}
              {gallery.length > 1 && (
                <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-none md:max-h-[550px] shrink-0 md:w-24 w-full">
                  {gallery.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`shrink-0 relative overflow-hidden h-20 w-16 md:h-24 md:w-20 rounded-xl transition-all duration-300 border ${
                        index === activeImage
                          ? 'border-rose-400 ring-2 ring-rose-100 opacity-100 scale-105 shadow-sm'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Prominent Main Image with Luxury styling */}
              <div className="flex-1 relative overflow-hidden rounded-[24px] md:rounded-[32px] shadow-lg bg-stone-50 group border border-rose-100/50">
                <img
                  src={gallery[activeImage]}
                  alt={product.name}
                  className="w-full h-[450px] md:h-[550px] object-cover transition-transform duration-700 ease-out hover:scale-[1.03] cursor-zoom-in"
                  onClick={() => setShowZoom(true)}
                />
                <button
                  type="button"
                  onClick={() => setShowZoom(true)}
                  className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-stone-800 shadow-md hover:bg-white hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <ZoomIn size={14} /> Zoom
                </button>
                <div className="absolute inset-y-1/2 left-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    type="button"
                    onClick={() => setActiveImage((prev) => (prev === 0 ? gallery.length - 1 : prev - 1))}
                    className="rounded-full bg-white/90 p-2.5 shadow-md hover:bg-white hover:scale-110 transition-all text-stone-800"
                  >
                    <ChevronLeft size={20} />
                  </button>
                </div>
                <div className="absolute inset-y-1/2 right-4 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    type="button"
                    onClick={() => setActiveImage((prev) => (prev === gallery.length - 1 ? 0 : prev + 1))}
                    className="rounded-full bg-white/90 p-2.5 shadow-md hover:bg-white hover:scale-110 transition-all text-stone-800"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

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
            <div className="rounded-[32px] bg-white/80 backdrop-blur-md p-8 shadow-[0_12px_40px_rgba(251,180,189,0.12)] border border-white/60">
              <p className="text-xs uppercase tracking-[0.3em] text-rose-500 font-semibold mb-2">Signature Selection</p>
              <h1 className="text-3xl md:text-4xl font-serif font-medium tracking-wide text-stone-900 mb-3 leading-tight">{product.name}</h1>
              <div className="flex items-baseline gap-4 mb-4">
                <p className="text-2xl font-light text-rose-700 tracking-wider">{formatPrice(product.price)}</p>
                <span className="text-xs uppercase tracking-widest px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 font-semibold border border-rose-100/50">
                  {product.category}
                </span>
              </div>
              <p className="text-xs uppercase tracking-widest text-stone-400 mb-6 font-medium">
                Availability: <span className={product.stock && product.stock > 0 ? 'text-emerald-600 font-semibold' : 'text-rose-500 font-semibold'}>
                  {product.stock && product.stock > 0 ? 'In stock' : 'Out of stock'}
                </span>
              </p>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-bold mb-3">Select Size</p>
                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes?.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] h-12 rounded-full border text-xs tracking-wider uppercase font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center ${
                          selectedSize === size
                            ? 'border-stone-900 bg-stone-900 text-white shadow-md'
                            : 'border-stone-200 bg-white/50 text-stone-600 hover:border-stone-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-rose-50/40 border border-rose-100/40 p-4 text-sm text-stone-600">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                    <p className="text-xs uppercase tracking-widest text-stone-500 font-bold">Estimated Delivery</p>
                  </div>
                  <p className="text-stone-800 font-semibold ml-3.5 leading-relaxed">{product.delivery}</p>
                </div>
              </div>

              {/* Spacing between Delivery input and Add to Cart button is exactly 12px–16px (mt-4 is 16px) */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleCart}
                  disabled={product.stock === 0}
                  className={`w-full flex items-center justify-center gap-3 py-4 px-8 rounded-full font-semibold uppercase tracking-[0.2em] text-xs text-white shadow-md transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${
                    product.stock === 0
                      ? 'bg-stone-300 cursor-not-allowed'
                      : inCart 
                        ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200 hover:shadow-lg' 
                        : 'bg-stone-950 hover:bg-rose-500 shadow-stone-950/10 hover:shadow-rose-200/50 hover:shadow-lg'
                  }`}
                >
                  <ShoppingBag size={18} />
                  {inCart ? 'In Cart' : 'Add to Cart'}
                </button>
              </div>

              <div className="mt-6 text-center text-[10px] uppercase tracking-widest text-stone-400 font-semibold">
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
