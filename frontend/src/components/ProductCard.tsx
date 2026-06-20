import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShoppingBag, Heart } from 'lucide-react';
import { Product, useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { getImageUrl } from '../config';

interface ProductCardProps {
  product: Product;
  badge?: 'new' | 'bestseller';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, badge }) => {
  const { addToCart, cartItems } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const inCart = cartItems.some((item) => item.id === product.id);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCart || product.stock === 0) return;
    addToCart(product);
    setAdded(true);
    timeoutRef.current = window.setTimeout(() => setAdded(false), 2200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setWishlisted(!wishlisted);
  };

  const buttonLabel = product.stock === 0
    ? 'Out of stock'
    : inCart
      ? 'In Cart ✓'
      : added
        ? 'Added ✓'
        : 'Add to Cart';

  const displayImage = hovered && product.images && product.images.length > 1
    ? product.images[1]
    : product.image || product.images?.[0] || '';

  return (
    <Link
      to={`/product/${product.id}`}
      className="card-product group overflow-hidden h-full flex flex-col transition-all duration-500 rounded-none border-b border-luxury-rosePink/10 hover:shadow-2xl bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image Container */}
      <div className="relative bg-luxury-cream overflow-hidden aspect-[3/4] flex items-center justify-center">
        {/* Product Badge */}
        {badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-md ${
              badge === 'new' 
                ? 'bg-luxury-softPink text-luxury-darkRose' 
                : 'bg-luxury-rose text-white'
            }`}>
              {badge === 'new' ? '✨ New' : '⭐ Best Seller'}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 bg-white rounded-full p-2.5 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-110"
        >
          <Heart 
            size={20} 
            className={`transition-all duration-300 ${wishlisted ? 'fill-luxury-darkRose text-luxury-darkRose' : 'text-luxury-stone'}`} 
          />
        </button>

        {/* Lazy loaded image */}
        <img
          src={getImageUrl(displayImage)}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-grayLight via-white to-luxury-grayLight animate-shimmer"></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-3 sm:p-5 flex flex-col bg-white">
        {/* Category */}
        <p className="text-[9px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-luxury-rosePink font-bold mb-1.5 sm:mb-2">
          {product.category}
        </p>

        {/* Product Name */}
        <h3 className="text-sm sm:text-lg font-serif font-bold text-luxury-charcoal mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-luxury-champagne transition-colors duration-300">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-[11px] sm:text-sm text-luxury-stone mb-3 sm:mb-4 line-clamp-2 flex-1 font-light leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price and Stock */}
        <div className="mb-3 sm:mb-5">
          <p className="text-base sm:text-xl font-bold text-luxury-charcoal">
            {formatPrice(product.price)}
          </p>
          {product.stock !== undefined && (
            <p className={`text-[9px] sm:text-xs mt-1 uppercase tracking-wider font-semibold ${
              product.stock > 0 ? 'text-luxury-stone' : 'text-red-500'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2.5 sm:py-3.5 border border-luxury-charcoal font-bold text-[10px] sm:text-xs uppercase tracking-normal sm:tracking-[0.1em] transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 group/btn ${
            product.stock === 0
              ? 'bg-luxury-grayLight text-luxury-grayDark border-luxury-grayLight cursor-not-allowed opacity-60'
              : inCart || added
                ? 'bg-luxury-charcoal text-white hover:bg-black'
                : 'bg-transparent text-luxury-charcoal hover:bg-luxury-charcoal hover:text-white'
          }`}
        >
          {product.stock === 0 ? (
            <>
              <ShoppingBag size={14} />
              <span>Out of stock</span>
            </>
          ) : inCart || added ? (
            <>
              <Check size={14} />
              <span>{buttonLabel}</span>
            </>
          ) : (
            <>
              <ShoppingBag size={14} className="group-hover/btn:scale-110 transition-transform" />
              <span>{buttonLabel}</span>
            </>
          )}
        </button>
      </div>
    </Link>
  );
};
