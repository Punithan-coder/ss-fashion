import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => Boolean(localStorage.getItem('ssfashion-admin-token')));
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsAdmin(Boolean(localStorage.getItem('ssfashion-admin-token')));
  }, [location.pathname]);

  const adminLink = {
    path: isAdmin ? '/admin/dashboard' : '/admin',
    label: isAdmin ? 'Dashboard' : 'Admin',
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    adminLink,
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-lg border-b border-luxury-grayLight' 
        : 'bg-luxury-cream border-b border-luxury-grayLight'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-rose-300 transition-all brightness-125">
              SS Fashion
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-all duration-300 relative ${
                  isActive(link.path)
                    ? 'text-luxury-darkRose'
                    : 'text-luxury-stone hover:text-luxury-darkRose'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-luxury-darkRose to-luxury-roseGold"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/shop"
              className="px-6 py-2.5 bg-gradient-to-r from-luxury-darkRose to-luxury-rose text-white rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Explore
            </Link>

            <Link 
              to="/cart" 
              className="relative flex items-center text-luxury-darkRose hover:text-luxury-rose transition-colors duration-300 group"
            >
              <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-luxury-softPink text-luxury-darkRose text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-luxury-darkRose hover:bg-luxury-softPink rounded-full transition-all"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-luxury-grayLight pt-4 space-y-2 animate-slideUp">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-sm font-semibold py-3 px-4 rounded-lg transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-luxury-softPink text-luxury-darkRose'
                    : 'text-luxury-stone hover:bg-luxury-blush'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-3 border-luxury-grayLight" />
            <Link
              to="/shop"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center bg-gradient-to-r from-luxury-darkRose to-luxury-rose text-white font-semibold py-3 rounded-full transition-all hover:shadow-lg"
            >
              Explore Collection
            </Link>
            <Link
              to="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center text-sm font-semibold py-3 px-4 text-luxury-stone hover:text-luxury-darkRose transition-colors"
            >
              <ShoppingBag size={20} className="mr-3" />
              Cart
              {cartCount > 0 && (
                <span className="ml-auto bg-luxury-softPink text-luxury-darkRose text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};
