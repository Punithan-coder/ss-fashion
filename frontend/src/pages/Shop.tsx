import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { products as fallbackProducts, categories } from '../data/products';
import { ProductCard, QuickViewModal } from '../components';
import { Product } from '../context/CartContext';

export const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => {
        if (data?.products) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        setError('Unable to load live product inventory. Showing featured collection.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory && product.active !== false;
    });

    switch (sortBy) {
      case 'price-low':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'newest':
        return [...filtered].sort((a, b) => {
          return new Date(b.addedAt || '').getTime() - new Date(a.addedAt || '').getTime();
        });
      case 'featured':
      default:
        return filtered;
    }
  }, [products, searchTerm, selectedCategory, sortBy]);

  const FilterSection = () => (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-luxury-grayLight">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-luxury-darkRose mb-4 flex items-center gap-2">
          <SlidersHorizontal size={20} />
          Filter by Category
        </h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-3 text-luxury-stone cursor-pointer hover:text-luxury-darkRose transition-colors">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-4 h-4 text-luxury-darkRose accent-luxury-darkRose"
              />
              <span className="font-medium">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-6 border-luxury-grayLight" />

      <div>
        <h3 className="text-lg font-semibold text-luxury-darkRose mb-4">Sort by</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-3 border border-luxury-grayLight rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-rose bg-white text-luxury-stone font-medium"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-luxury-cream">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-luxury-softPink/40 via-white to-luxury-lavender/30 py-12 md:py-16 border-b border-luxury-grayLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-sm uppercase tracking-widest font-bold text-luxury-rose mb-3 inline-block">Our Collection</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-luxury-darkRose mb-4">
              Curated Fashion
            </h1>
            <p className="text-luxury-stone text-lg max-w-2xl mx-auto">
              Explore our premium selection of sarees, kurtis, dresses, and more. Handpicked for elegance and quality.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-luxury-rose" size={20} />
            <input
              type="text"
              placeholder="Search for style, color, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-luxury-grayLight rounded-full bg-white text-luxury-stone placeholder-luxury-stone/50 focus:outline-none focus:border-luxury-rose focus:ring-0 font-medium shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <FilterSection />
            </div>

            {/* Products Section */}
            <div className="lg:col-span-3">
              {/* Header with Mobile Filter Button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <p className="text-luxury-stone font-medium">
                    Showing <span className="font-bold text-luxury-darkRose">{filteredAndSortedProducts.length}</span> products
                  </p>
                  {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-luxury-rose text-luxury-darkRose hover:bg-luxury-softPink transition-colors"
                >
                  <SlidersHorizontal size={18} />
                  Filters
                </button>
              </div>

              {/* Mobile Filters Modal */}
              {mobileFiltersOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black/50 flex items-end">
                  <div className="bg-white w-full rounded-t-2xl p-6 space-y-4 animate-slideUp max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-serif font-bold text-luxury-darkRose">Filters</h2>
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="p-2 hover:bg-luxury-softPink rounded-full"
                      >
                        <X size={24} className="text-luxury-darkRose" />
                      </button>
                    </div>
                    <FilterSection />
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full bg-luxury-darkRose text-white py-3 rounded-full font-semibold transition-all hover:bg-luxury-rose"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, idx) => (
                    <div key={idx} className="skeleton rounded-2xl h-96"></div>
                  ))}
                </div>
              ) : filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <div 
                      key={product.id}
                      onClick={() => setQuickViewProduct(product)}
                      className="cursor-pointer"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-xl text-luxury-stone mb-6">
                    No products match your selection
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-luxury-darkRose to-luxury-rose text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          isOpen={true}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
