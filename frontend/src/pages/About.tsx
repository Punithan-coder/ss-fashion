import React from 'react';
import { Heart, Target, Award, Users } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="page bg-luxury-cream text-luxury-charcoal">
      {/* Header */}
      <section className="relative py-32 md:py-48 flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=800&fit=crop" 
            alt="Fashion Editorial" 
            className="w-full h-full object-cover filter contrast-110 saturate-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-cream via-luxury-cream/60 to-black/20"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center animate-slideUp">
          <span className="text-sm font-bold text-luxury-charcoal uppercase tracking-[0.3em] mb-4 block">The Heritage</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-luxury-charcoal mb-6 drop-shadow-sm">About SS Fashion</h1>
          <p className="text-xl md:text-2xl text-luxury-stone max-w-2xl mx-auto font-light leading-relaxed">
            Luxury fashion that celebrates women's confidence, elegance, and timeless grace.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-charcoal mb-8">
                Our Story
              </h2>
              <div className="w-16 h-px bg-luxury-champagne mb-8"></div>
              <p className="text-luxury-stone text-lg mb-6 leading-relaxed font-light">
                SS Fashion was born from a passion for creating premium, elegant clothing
                that makes every woman feel confident and beautiful. What started as a dream
                has grown into a trusted brand loved by fashion enthusiasts across India.
              </p>
              <p className="text-luxury-stone text-lg mb-6 leading-relaxed font-light">
                We believe that fashion is not just about clothes—it's about expressing
                your personality, celebrating your uniqueness, and embracing your best self.
              </p>
              <p className="text-luxury-stone text-lg leading-relaxed font-light">
                Every piece in our collection is carefully curated to meet the highest
                standards of quality, comfort, and style.
              </p>
            </div>
            <div className="order-1 lg:order-2 rounded-none overflow-hidden h-[500px] shadow-2xl relative group">
              <div className="absolute inset-0 border-8 border-luxury-cream/20 z-10 pointer-events-none"></div>
              <img
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=1000&fit=crop"
                alt="SS Fashion Brand"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-luxury-ivory border-y border-luxury-rosePink/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white p-12 shadow-xl hover:shadow-2xl transition-shadow duration-300 group">
              <div className="w-16 h-16 rounded-full bg-luxury-rosePink/10 flex items-center justify-center mb-8 group-hover:bg-luxury-rosePink/20 transition-colors">
                <Target size={32} className="text-luxury-darkRose" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-serif font-bold text-luxury-charcoal mb-4">
                Our Mission
              </h3>
              <p className="text-luxury-stone leading-relaxed font-light text-lg">
                To provide accessible luxury fashion that empowers women to express their
                individuality with confidence. We are committed to offering premium quality
                at reasonable prices while maintaining ethical practices and sustainability.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-12 shadow-xl hover:shadow-2xl transition-shadow duration-300 group">
              <div className="w-16 h-16 rounded-full bg-luxury-champagne/10 flex items-center justify-center mb-8 group-hover:bg-luxury-champagne/20 transition-colors">
                <Heart size={32} className="text-luxury-champagne" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-serif font-bold text-luxury-charcoal mb-4">
                Our Vision
              </h3>
              <p className="text-luxury-stone leading-relaxed font-light text-lg">
                To be the most trusted and beloved fashion brand in India, known for our
                exceptional quality, innovative designs, and outstanding customer service.
                We aspire to create a community where every woman feels celebrated and inspired.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promises */}
      <section className="py-24 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-sm uppercase tracking-[0.2em] text-luxury-rosePink font-bold mb-4 block">The SS Fashion Standard</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-charcoal mb-6">
              Our Promises to You
            </h2>
            <div className="w-16 h-px bg-luxury-champagne mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                icon: Award,
                title: 'Premium Quality',
                description: 'Only the finest fabrics and materials are used in our products'
              },
              {
                icon: Users,
                title: 'Customer First',
                description: 'Your satisfaction is our priority, with exceptional service always'
              },
              {
                icon: Target,
                title: 'Authentic Style',
                description: 'Unique designs that make you stand out from the crowd'
              },
              {
                icon: Heart,
                title: 'Ethical Fashion',
                description: 'We care about people and planet in everything we do'
              },
            ].map((promise, index) => {
              const Icon = promise.icon;
              return (
                <div key={index} className="text-center group cursor-default">
                  <div className="flex justify-center mb-6 transform group-hover:-translate-y-2 transition-transform duration-300">
                    <div className="text-luxury-champagne">
                      <Icon size={48} strokeWidth={1} />
                    </div>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-luxury-charcoal mb-3">
                    {promise.title}
                  </h3>
                  <p className="text-luxury-stone font-light">
                    {promise.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="py-24 bg-luxury-ivory border-y border-luxury-rosePink/10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-luxury-rosePink/10 via-luxury-champagne/10 to-transparent p-12 md:p-16 border border-luxury-champagne/30 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-champagne/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <h2 className="text-4xl font-serif font-bold mb-8 text-luxury-charcoal text-center">
              Our Quality Promise
            </h2>
            <ul className="space-y-6 text-lg max-w-2xl mx-auto">
              {[
                'Premium fabrics sourced from trusted suppliers globally',
                'Rigorous quality and detail checks before dispatch',
                'Perfect fit, elegant drape, and comfort guaranteed',
                'Durable, timeless products crafted to last for years',
                '30-day effortless return policy with personalized support',
                'Ethical sourcing and fair labor practices unconditionally'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start group">
                  <span className="text-luxury-champagne mr-4 mt-1 transform group-hover:scale-125 transition-transform"><Award size={20} /></span>
                  <span className="text-luxury-stone font-light">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-charcoal mb-6">
              Why Customers Love SS Fashion
            </h2>
            <div className="w-16 h-px bg-luxury-champagne mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                number: '10K+',
                label: 'Happy Customers',
                description: 'Trusted by thousands of confident women'
              },
              {
                number: '500+',
                label: 'Premium Products',
                description: 'Constantly curated collection of elegant styles'
              },
              {
                number: '5★',
                label: 'Customer Rating',
                description: 'Consistently high satisfaction and reviews'
              },
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white p-12 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-luxury-rosePink/5">
                <p className="text-6xl font-serif font-bold text-luxury-champagne mb-4">
                  {stat.number}
                </p>
                <p className="text-2xl font-bold text-luxury-charcoal mb-3">
                  {stat.label}
                </p>
                <p className="text-luxury-stone font-light">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
