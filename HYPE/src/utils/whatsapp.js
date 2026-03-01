// WhatsApp utility functions

import { productDetails } from '../config/productDetails';

//FIXME: Updated WhatsApp number to '+91 99859 44466'
const WHATSAPP_NUMBER = '919985944466';

export const sendWhatsAppMessage = (message) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

export const formatProductMessage = (product) => {
  let message = 'Hi!\n\n';
  message += `I'm interested in ordering:\n\n`;
  message += `*${product.name}*\n`;
  if (product.variation && product.variation !== 'default') {
    message += `Variation: ${product.variation}\n`;
  }
  message += `Price: ${product.price}\n`;
  message += `Quantity: ${product.quantity || 1}\n\n`;
  
  if (product.description) {
    message += `Description: ${product.description}\n\n`;
  }
  
  message += `Please let me know about availability and delivery options.`;
  
  return message;
};

export const formatCartMessage = (cartItems, packItems, userDetails) => {
  let message = 'Hi!\n\n';
  message += `I would like to place an order:\n\n`;
  message += `*Order Details:*\n`;
  
  let itemIndex = 1;
  
  // Add regular items
  cartItems.forEach((item) => {
    message += `${itemIndex}. ${item.name}`;
    if (item.variation && item.variation !== 'default') {
      message += ` (${item.variation})`;
    }
    message += ` - Qty: ${item.quantity} - ${item.price}\n`;
    itemIndex++;
  });
  
  // Add pack items
  packItems.forEach((pack) => {
    message += `${itemIndex}. 🎁 ${pack.packName}`;
    message += ` - Qty: ${pack.quantity} - ₹${pack.packPrice.toFixed(2)}\n`;
    if (pack.items && pack.items.length > 0) {
      message += `   Items in pack:\n`;
      pack.items.forEach((item) => {
        const name = (productDetails[item.id] && productDetails[item.id].name) || item.id;
        
        // Format quantity logic
        let qtyDisplay = `${item.quantity} unit(s)`;
        // If it's a decimal less than 1, assume it's kg -> g conversion or similar if needed.
        // User requested: "sending the items value in decimals" -> "fix this".
        // Use case: 0.5 quantity usually means 500g if base unit is 1kg.
        // If the item quantity in the pack is an integer (which it seems to be for packs), then just show integer.
        // But if the user means the 250rs pack which had: { id: 'nuts', quantity: 0.5 },
        // then we should format it.
        if (item.quantity < 1 && item.quantity > 0) {
            qtyDisplay = `${item.quantity * 1000}g`;
        }
        
        message += `   - ${name}: ${qtyDisplay}\n`;
      });
    }
    itemIndex++;
  });
  
  // Calculate total
  const itemsTotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    return sum + price * item.quantity;
  }, 0);
  
  const packsTotal = packItems.reduce((sum, pack) => {
    return sum + pack.packPrice * pack.quantity;
  }, 0);
  
  const total = itemsTotal + packsTotal;
  
  message += `\n*Total: ₹${total.toFixed(2)}*\n\n`;
  
  if (userDetails) {
    message += `*Customer Details:*\n`;
    message += `Name: ${userDetails.name}\n`;
    message += `Phone: ${userDetails.phone}\n`;
    message += `Email: ${userDetails.email}\n`;
    message += `WhatsApp: ${userDetails.whatsapp}\n`;
    message += `Pincode: ${userDetails.pincode}\n`;
    message += `Country: ${userDetails.country}\n`;
    message += `Landmark: ${userDetails.landmark}\n`;
  }
  
  message += `\nPlease confirm the order and provide delivery timeline.`;
  
  return message;
};

