import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const state = location.state as {
    customerDetails: {
      fullName: string;
      mobileNumber: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
    };
    total: number;
  } | null;

  if (!state) {
    return (
      <div className="page min-h-screen bg-gray-50">
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-2xl text-gray-600 mb-8">
              Order confirmation not found. Please place a new order.
            </p>
            <Link to="/shop" className="btn-luxury inline-block">
              Continue Shopping
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const { customerDetails, total } = state;

  return (
    <div className="page min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-serif font-bold">Order Confirmed</h1>
        </div>
      </section>

      {/* Confirmation */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <CheckCircle size={64} className="text-green-600" />
            </div>

            <h2 className="text-3xl font-serif font-bold text-black mb-4">
              Thank You for Your Order!
            </h2>

            <p className="text-gray-600 text-lg mb-8">
              Your order has been received and sent to our team via WhatsApp. We will confirm your order shortly.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-xl font-semibold text-black mb-4">
                Delivery Information
              </h3>

              <div className="space-y-2 text-gray-700 mb-4">
                <p>
                  <span className="font-semibold">Name:</span> {customerDetails.fullName}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {customerDetails.mobileNumber}
                </p>
                <p>
                  <span className="font-semibold">Address:</span> {customerDetails.address}
                </p>
                <p>
                  <span className="font-semibold">City:</span> {customerDetails.city}
                </p>
                <p>
                  <span className="font-semibold">State:</span> {customerDetails.state}
                </p>
                <p>
                  <span className="font-semibold">Pincode:</span> {customerDetails.pincode}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-lg">
                  <span className="font-semibold">Total Amount:</span> ₹{total}
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
              <p className="text-blue-900 text-sm">
                <span className="font-semibold">Next Steps:</span> You will receive WhatsApp confirmation from our team. If you don't receive it within 5 minutes, please contact us.
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Link to="/" className="block btn-luxury">
                Back to Home
              </Link>
              <Link
                to="/shop"
                className="block btn-luxury-secondary"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
