import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products as fallbackProducts } from '../data/products';
import { Product } from '../context/CartContext';
import { ProductCard, QuickViewModal, FloatingWhatsAppButton } from '../components';
import { ArrowRight, Sparkles, Star, Package, Award, Headphones } from 'lucide-react';
import { API_BASE_URL } from '../config';

const heroBannerImage = 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&h=700&fit=crop';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        if (data?.products) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        setProducts(fallbackProducts);
      })
      .finally(() => setLoading(false));
  }, []);

  // Separate products by section
  const newArrivals = products.filter(p => p.active !== false).slice(0, 4);
  const trendingProducts = products.filter(p => p.active !== false).slice(4, 8);

  // Categories
  const categories = [
    { name: 'Sarees', icon: '👗', color: 'from-luxury-softPink to-luxury-rose' },
    { name: 'Kurtis', icon: '👚', color: 'from-luxury-lavender to-luxury-lavenderAccent' },
    { name: 'Dresses', icon: '👗', color: 'from-luxury-roseGold to-luxury-warmBeige' },
    { name: 'Tops', icon: '🧥', color: 'from-luxury-blush to-luxury-softPink' },
    { name: 'Bottoms', icon: '👖', color: 'from-luxury-beige to-luxury-warmBeige' },
  ];

  // Reviews
  const reviews = [
    {
      name: 'Priya M.',
      rating: 5,
      text: 'Absolutely love the quality and design! The sarees are so elegant and the delivery was super fast.',
      image: '👤',
    },
    {
      name: 'Anjali K.',
      rating: 5,
      text: 'Best fashion collection I\'ve found. The customer service is excellent and very responsive.',
      image: '👤',
    },
    {
      name: 'Meera S.',
      rating: 5,
      text: 'Premium quality, affordable prices. SS Fashion is my go-to for all occasions!',
      image: '👤',
    },
  ];

  return (
    <div className="min-h-screen bg-luxury-cream">
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden h-screen md:h-[80vh] lg:h-screen flex items-center">
          <div className="absolute inset-0">
            <img
              src={heroBannerImage}
              alt="SS Fashion luxury collection"
              className="h-full w-full object-cover filter contrast-125 saturate-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10"></div>
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-16 md:py-0">
            <div className="max-w-2xl animate-slideUp">
              <div className="inline-flex items-center gap-2 mb-6 bg-white/20 backdrop-blur-md border border-white/30 px-5 py-2.5 rounded-full shadow-lg">
                <Sparkles size={18} className="text-yellow-300" />
                <span className="text-sm font-bold text-white uppercase tracking-[0.2em] drop-shadow-md">New Collection</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-[1.2] sm:leading-[1.1] drop-shadow-lg">
                Timeless Elegance, Modern Confidence
              </h1>

              <p className="text-base sm:text-xl md:text-2xl text-luxury-cream/90 mb-8 sm:mb-10 max-w-xl leading-relaxed font-light drop-shadow-md">
                Discover our carefully curated collection of premium women's fashion designed for every occasion.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link
                  to="/shop"
                  className="btn-luxury"
                >
                  Explore Collection
                  <ArrowRight size={20} className="ml-2 inline-block" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/80 text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-luxury-charcoal hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 animate-fadeIn">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm uppercase tracking-widest font-bold text-luxury-rose">✨ Trending</span>
              </div>
              <h2 className="section-title mb-4">New Arrivals</h2>
              <p className="text-luxury-stone text-lg max-w-2xl">
                Fresh styles just added to our collection. Discover the latest trends in women's fashion.
              </p>
            </div>

            {/* Loading Skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="skeleton rounded-2xl h-96"></div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  {newArrivals.map((product) => (
                    <div key={product.id} onClick={() => setQuickViewProduct(product)} className="cursor-pointer">
                      <ProductCard product={product} badge="new" />
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-luxury-darkRose hover:text-luxury-rose font-semibold transition-colors duration-300"
                  >
                    View All New Arrivals
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>






        {/* Features Section */}
        <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-luxury-ivory border-t border-luxury-rosePink/10">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center p-8 group hover:-translate-y-2 transition-all duration-300 cursor-default animate-slideUp">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-luxury-rosePink/10 flex items-center justify-center group-hover:bg-luxury-rosePink/20 transition-colors duration-300">
                  <Package size={36} className="text-luxury-darkRose" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-luxury-charcoal mb-4">Premium Delivery</h3>
                <p className="text-luxury-stone leading-relaxed">Shipped within 24 hours with signature packaging and dedicated tracking.</p>
              </div>
              <div className="text-center p-8 group hover:-translate-y-2 transition-all duration-300 cursor-default animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-luxury-champagne/10 flex items-center justify-center group-hover:bg-luxury-champagne/20 transition-colors duration-300">
                  <Award size={36} className="text-luxury-champagne" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-luxury-charcoal mb-4">Luxury Quality</h3>
                <p className="text-luxury-stone leading-relaxed">Authentic, high-quality fabrics and expert craftsmanship in every piece.</p>
              </div>
              <div className="text-center p-8 group hover:-translate-y-2 transition-all duration-300 cursor-default animate-slideUp" style={{ animationDelay: '0.2s' }}>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-luxury-rosePink/10 flex items-center justify-center group-hover:bg-luxury-rosePink/20 transition-colors duration-300">
                  <Headphones size={36} className="text-luxury-darkRose" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-luxury-charcoal mb-4">Bespoke Support</h3>
                <p className="text-luxury-stone leading-relaxed">Dedicated 24/7 personal shopping assistance for all your styling needs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl bg-gradient-to-r from-luxury-darkRose/10 via-luxury-softPink/10 to-luxury-lavender/10 p-12 md:p-16 text-center border border-luxury-rose/30">
              <h2 className="section-title mb-4">Ready to Refresh Your Wardrobe?</h2>
              <p className="text-luxury-stone text-lg mb-8 max-w-2xl mx-auto">
                Explore our full collection and find pieces that make you feel confident and beautiful.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-luxury-darkRose to-luxury-rose text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Shop Now
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isOpen={true}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Floating WhatsApp Button */}
      <FloatingWhatsAppButton />
    </div>
  );
};
