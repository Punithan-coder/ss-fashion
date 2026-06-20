export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
};

export const generateOrderSummary = (
  customerDetails: {
    fullName: string;
    mobileNumber: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  },
  cartItems: Array<{
    name: string;
    price: number;
    quantity: number;
  }>,
  total: number
) => {
  let summary = `*SS FASHION - ORDER SUMMARY*\n\n`;
  summary += `*Customer Details:*\n`;
  summary += `Name: ${customerDetails.fullName}\n`;
  summary += `Mobile: ${customerDetails.mobileNumber}\n`;
  summary += `Address: ${customerDetails.address}\n`;
  summary += `City: ${customerDetails.city}\n`;
  summary += `State: ${customerDetails.state}\n`;
  summary += `Pincode: ${customerDetails.pincode}\n\n`;

  summary += `*Order Items:*\n`;
  cartItems.forEach((item, index) => {
    summary += `${index + 1}. ${item.name}\n`;
    summary += `   Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}\n`;
  });

  summary += `\n*Total Amount: ₹${total}*\n`;
  return summary;
};

export const sendOrderViaWhatsApp = (orderSummary: string) => {
  const phoneNumber = '918072003011'; // Replace with actual store owner number
  const encodedMessage = encodeURIComponent(orderSummary);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};
