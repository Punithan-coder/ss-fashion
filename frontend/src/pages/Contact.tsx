import React, { useState } from 'react';
import { Phone, Mail, Clock, Sparkles, MessageCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="page bg-luxury.cream">
      <section className="bg-gradient-to-r from-rose-100 via-white to-lavender-100 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="uppercase tracking-[0.35em] text-rose-600 text-sm mb-4">Contact Us</p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 mb-4">
            Premium Support for SS Fashion
          </h1>
          <p className="text-stone-600 text-lg max-w-3xl mx-auto">
            Reach our customer support team for styling guidance, order assistance, and VIP care.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-[32px] p-8 shadow-lg text-center">
              <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
                <Phone size={28} />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-3">Call Us</h3>
              <p className="text-stone-600">+91 7666 666 666</p>
              <p className="text-stone-600 mt-2">+91 9876 543 210</p>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-lg text-center">
              <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
                <Mail size={28} />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-3">Email</h3>
              <p className="text-stone-600">info@ssfashion.com</p>
              <p className="text-stone-600 mt-2">support@ssfashion.com</p>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-lg text-center">
              <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-3">Business Hours</h3>
              <p className="text-stone-600">Mon - Fri: 10 AM - 8 PM</p>
              <p className="text-stone-600">Sat: 10 AM - 7 PM</p>
              <p className="text-stone-600">Sun: 12 PM - 6 PM</p>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-lg text-center">
              <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
                <Sparkles size={28} />
              </div>
              <h3 className="text-xl font-semibold text-stone-900 mb-3">Premium Care</h3>
              <p className="text-stone-600">Personal styling advice with every purchase.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-[32px] p-10 shadow-lg">
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Aanya Kapoor"
                    required
                    className="w-full px-5 py-4 border border-rose-100 rounded-3xl bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="aanya@example.com"
                    required
                    className="w-full px-5 py-4 border border-rose-100 rounded-3xl bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    className="w-full px-5 py-4 border border-rose-100 rounded-3xl bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help you today?"
                    required
                    className="w-full px-5 py-4 border border-rose-100 rounded-3xl bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Share the details of your inquiry..."
                    rows={5}
                    required
                    className="w-full px-5 py-4 border border-rose-100 rounded-3xl bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                <button type="submit" className="btn-luxury w-full">
                  Send Message
                </button>

                {submitted && (
                  <p className="text-rose-700 text-center font-semibold mt-3">
                    ✓ Your request has been received. We&apos;ll respond soon.
                  </p>
                )}
              </form>
            </div>

            <div className="bg-rose-50 rounded-[32px] p-10 shadow-lg">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-rose-700 shadow-sm">
                  <MessageCircle size={28} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-rose-600">Customer Support</p>
                  <h2 className="text-3xl font-serif font-bold text-stone-900">Luxury support that feels personal</h2>
                </div>
              </div>

              <div className="space-y-6 text-stone-600">
                <div>
                  <h3 className="font-semibold text-stone-900 mb-2">Fast Response</h3>
                  <p>Our specialist team replies promptly with thoughtful solutions.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 mb-2">Guided Styling</h3>
                  <p>Receive styling advice curated for your wardrobe and events.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 mb-2">Secure Orders</h3>
                  <p>Your details and purchase are handled with premium care and privacy.</p>
                </div>
              </div>

              <div className="mt-10">
                <p className="text-stone-700 font-semibold mb-4">Follow Us</p>
                <div className="flex items-center gap-4 text-rose-700">
                  <a href="#" className="transition hover:text-rose-900">Instagram</a>
                  <a href="#" className="transition hover:text-rose-900">Pinterest</a>
                  <a href="#" className="transition hover:text-rose-900">Facebook</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
