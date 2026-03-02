const shiprocketService = require("../utils/shiprocketService");

// Accepts an order document (mongoose) with fields needed for Shiprocket
exports.createShiprocketOrder = async (order) => {
  console.log("[ShiprocketController] Processing order ID:", order._id);

  // Build payload according to shiprocketService expectations
  // normalize customer data for both new and legacy orders
  const cust = order.customer || {};
  const payload = {
    _id: order._id,
    items: order.items || [],
    customer: {
      name: cust.name || order.customerName || order.name || "",
      email: cust.email || order.email || "",
      phone: cust.phone || order.phone || "",
      whatsapp: cust.whatsapp || order.whatsapp || "",
      address: cust.address || order.address || "",
      city: cust.city || order.city || "",
      state: cust.state || order.state || "",
      country: cust.country || order.country || "",
      pincode: cust.pincode || order.pincode || "",
    },
    amount: order.totalAmount || order.amount || 0
  };

  console.log("[ShiprocketController] Payload prepared:", JSON.stringify(payload, null, 2));

  try {
    const result = await shiprocketService.createShiprocketOrder(payload);
    console.log("[ShiprocketController] Shiprocket order created successfully");
    return result;
  } catch (err) {
    console.error("[ShiprocketController] Shiprocket creation failed:", err.message || err);
    throw err;
  }
};
