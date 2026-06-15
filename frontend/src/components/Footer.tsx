import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Heart, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-luxury-ivory border-t border-luxury-grayLight mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-luxury-darkRose to-luxury-roseGold bg-clip-text text-transparent">
              SS Fashion
            </h3>
            <p className="text-luxury-stone leading-relaxed">
              Discover timeless elegance and modern confidence through our carefully curated collection of premium women's fashion.
            </p>
            <div className="flex gap-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 hover:bg-luxury-softPink rounded-full text-luxury-darkRose transition-all"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 hover:bg-luxury-softPink rounded-full text-luxury-darkRose transition-all"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 hover:bg-luxury-softPink rounded-full text-luxury-darkRose transition-all"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-luxury-darkRose mb-5 text-lg">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-luxury-stone hover:text-luxury-darkRose transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-luxury-stone hover:text-luxury-darkRose transition-colors font-medium">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-luxury-stone hover:text-luxury-darkRose transition-colors font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-luxury-stone hover:text-luxury-darkRose transition-colors font-medium">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif font-semibold text-luxury-darkRose mb-5 text-lg">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-luxury-stone hover:text-luxury-darkRose transition-colors font-medium">
                  Shipping Information
                </a>
              </li>
              <li>
                <a href="#" className="text-luxury-stone hover:text-luxury-darkRose transition-colors font-medium">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-luxury-stone hover:text-luxury-darkRose transition-colors font-medium">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-luxury-stone hover:text-luxury-darkRose transition-colors font-medium">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif font-semibold text-luxury-darkRose mb-5 text-lg">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Phone size={20} className="text-luxury-rose flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-luxury-stone">WhatsApp Support</p>
                  <p className="font-semibold text-luxury-darkRose">+91 99999-99999</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail size={20} className="text-luxury-rose flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-luxury-stone">Email</p>
                  <p className="font-semibold text-luxury-darkRose">hello@ssfashion.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-luxury-grayLight my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-luxury-stone">
          <p>
            © 2024 SS Fashion. All rights reserved. Made with <Heart size={14} className="inline text-luxury-rose fill-luxury-rose" /> for modern women.
          </p>
          <div className="flex gap-6 text-xs uppercase tracking-wider font-semibold">
            <a href="#" className="hover:text-luxury-darkRose transition-colors">Security</a>
            <a href="#" className="hover:text-luxury-darkRose transition-colors">Accessibility</a>
            <a href="#" className="hover:text-luxury-darkRose transition-colors">Sustainability</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
