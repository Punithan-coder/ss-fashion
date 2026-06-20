import React, { useState } from 'react';
import { X, ShoppingBag, Check, Heart } from 'lucide-react';
import { Product, useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { getImageUrl } from '../config';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  const inCart = cartItems.some((item) => item.id === product.id);
  const images = product.images || [product.image];

  const handleAddToCart = () => {
    if (inCart || product.stock === 0) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Header */}
        <div className="sticky top-0 bg-luxury-cream border-b border-luxury-grayLight flex items-center justify-between p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-luxury-darkRose">Quick View</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-luxury-softPink rounded-full transition-colors"
          >
            <X size={20} className="text-luxury-darkRose" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Image Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-luxury-blush rounded-2xl overflow-hidden h-56 sm:h-72 md:h-96">
              <img
                src={getImageUrl(images[selectedImage])}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`h-12 sm:h-16 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-luxury-darkRose'
                        : 'border-luxury-grayLight hover:border-luxury-rose'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between">
            {/* Product Info */}
            <div>
              <p className="text-sm uppercase tracking-widest text-luxury-rose font-semibold mb-2">
                {product.category}
              </p>
              <h3 className="text-3xl font-serif font-bold text-luxury-darkRose mb-3">
                {product.name}
              </h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-luxury-darkRose to-luxury-roseGold bg-clip-text text-transparent mb-4">
                {formatPrice(product.price)}
              </p>

              {product.description && (
                <p className="text-luxury-stone mb-6 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock !== undefined && (
                  <p className={`font-semibold ${
                    (product.stock ?? 0) > 0 ? 'text-luxury-stone' : 'text-red-500'
                  }`}>
                    {(product.stock ?? 0) > 0 ? `✓ ${product.stock} in stock` : 'Out of stock'}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              {(product.stock ?? 0) > 0 && (
                <div className="flex items-center gap-4">
                  <label className="text-sm font-semibold text-luxury-stone">Quantity:</label>
                  <div className="flex border border-luxury-grayLight rounded-full">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-luxury-softPink transition-colors"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 border-l border-r border-luxury-grayLight">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-luxury-softPink transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  product.stock === 0
                    ? 'bg-luxury-grayLight text-luxury-grayDark cursor-not-allowed opacity-60'
                    : inCart || added
                      ? 'bg-luxury-stone text-white hover:shadow-lg'
                      : 'bg-gradient-to-r from-luxury-darkRose to-luxury-rose text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {inCart ? (
                  <>
                    <Check size={24} />
                    <span>In Cart</span>
                  </>
                ) : added ? (
                  <>
                    <Check size={24} />
                    <span>Added ✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={24} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="w-full py-3 rounded-full font-semibold border-2 transition-all duration-300 flex items-center justify-center gap-2 border-luxury-rose hover:bg-luxury-softPink text-luxury-darkRose"
              >
                <Heart
                  size={20}
                  className={wishlisted ? 'fill-luxury-darkRose' : ''}
                />
                <span>{wishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
