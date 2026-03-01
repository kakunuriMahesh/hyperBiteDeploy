const shiprocketService = require("../utils/shiprocketService");

// Accepts an order document (mongoose) with fields needed for Shiprocket
exports.createShiprocketOrder = async (order) => {
  console.log("[ShiprocketController] Processing order ID:", order._id);

  // Build payload according to shiprocketService expectations
  const payload = {
    _id: order._id,
    items: order.items || [],
    customer: {
      name: order.customerName || "",
      address: order.address || "",
      city: order.city || "",
      pincode: order.pincode || "",
      phone: order.phone || "",
    },
    amount: order.totalAmount || 0
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
