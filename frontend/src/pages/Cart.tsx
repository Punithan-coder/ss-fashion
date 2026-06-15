import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

export const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const subtotal = getCartTotal();
  const shippingTotal = cartItems.reduce((acc, item) => acc + (item.shippingCost || 0) * item.quantity, 0);
  const total = subtotal + shippingTotal;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-cream">
        {/* Header */}
        <section className="bg-gradient-to-r from-luxury-softPink/40 via-white to-luxury-lavender/30 py-12 md:py-16 border-b border-luxury-grayLight">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-luxury-darkRose">Shopping Cart</h1>
          </div>
        </section>

        {/* Empty State */}
        <section className="py-24">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="text-6xl mb-6">🛍️</div>
            <h2 className="text-3xl font-serif font-bold text-luxury-darkRose mb-3">Your Cart is Empty</h2>
            <p className="text-lg text-luxury-stone mb-8">
              Start exploring our collection and add some beautiful pieces to your cart.
            </p>
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-luxury-darkRose to-luxury-rose text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Continue Shopping
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-luxury-softPink/40 via-white to-luxury-lavender/30 py-12 md:py-16 border-b border-luxury-grayLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-luxury-darkRose">Shopping Cart</h1>
          <p className="text-luxury-stone mt-2">
            You have <span className="font-bold text-luxury-darkRose">{cartItems.length}</span> item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-luxury-grayLight flex gap-4 sm:gap-6"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-luxury-blush rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || (item as any).images?.[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          to={`/product/${item.id}`}
                          className="text-lg font-semibold text-luxury-darkRose hover:text-luxury-rose transition-colors mb-2 line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-2xl font-bold bg-gradient-to-r from-luxury-darkRose to-luxury-roseGold bg-clip-text text-transparent">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-luxury-grayLight rounded-full bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-luxury-stone hover:text-luxury-darkRose transition-colors"
                            title="Decrease quantity"
                          >
                            <Minus size={18} />
                          </button>
                          <span className="px-4 py-1 font-bold text-luxury-darkRose min-w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-luxury-stone hover:text-luxury-darkRose transition-colors"
                            title="Increase quantity"
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                          title="Remove from cart"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal & Shipping */}
                    <div className="text-right flex flex-col justify-between items-end">
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-luxury-stone font-semibold">Shipping</p>
                        <p className="text-sm font-semibold text-luxury-stone mb-2">
                          {item.shippingCost ? formatPrice(item.shippingCost) : 'Free'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-luxury-stone font-semibold">Subtotal</p>
                        <p className="text-2xl font-bold text-luxury-darkRose">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-luxury-darkRose hover:text-luxury-rose font-semibold mt-8 transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md border border-luxury-grayLight p-8 sticky top-24 space-y-6">
                <h2 className="text-2xl font-serif font-bold text-luxury-darkRose border-b border-luxury-grayLight pb-4">
                  Order Summary
                </h2>

                {/* Items List */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-luxury-stone text-sm">
                      <span className="line-clamp-1">
                        {item.quantity}× {item.name}
                      </span>
                      <span className="font-semibold flex-shrink-0 ml-2">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-luxury-grayLight" />

                {/* Pricing Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-luxury-stone">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-luxury-stone">
                    <span>Shipping</span>
                    {shippingTotal === 0 ? (
                      <span className="font-semibold text-green-600">Free</span>
                    ) : (
                      <span className="font-semibold text-luxury-darkRose">{formatPrice(shippingTotal)}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-luxury-darkRose">Total</span>
                    <span className="font-bold bg-gradient-to-r from-luxury-darkRose to-luxury-roseGold bg-clip-text text-transparent">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <hr className="border-luxury-grayLight" />

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-luxury-darkRose to-luxury-rose text-white px-6 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </Link>

                <p className="text-xs text-center text-luxury-stone">
                  ✓ Secure checkout • ✓ 24/7 Support
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-luxury-ivory border-t border-luxury-grayLight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <p className="font-semibold text-luxury-darkRose">Fast Delivery</p>
              <p className="text-sm text-luxury-stone">Within 24 hours</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <p className="font-semibold text-luxury-darkRose">Secure Payment</p>
              <p className="text-sm text-luxury-stone">100% Safe</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💬</div>
              <p className="font-semibold text-luxury-darkRose">24/7 Support</p>
              <p className="text-sm text-luxury-stone">Via WhatsApp</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
