const axios = require("axios");

async function generateToken() {
  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    }
  );

  return response.data.token;
}

exports.createShiprocketOrder = async (order) => {
  try {
    console.log("[Shiprocket] Generating token...");
    const token = await generateToken();
    console.log("[Shiprocket] Token generated successfully");

    // Build order_items array from order.items (if available)
    let orderItems = [];
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
      orderItems = order.items.map((item) => ({
        name: item.name || "Product",
        sku: item.productId || item.id || `SKU-${item.name}`,
        units: item.quantity || 1,
        selling_price: item.price || 0
      }));
    } else {
      // Fallback if items not available
      orderItems = [
        {
          name: "Order Items",
          sku: "GENERAL",
          units: 1,
          selling_price: order.amount || 0
        }
      ];
    }

    const payload = {
      order_id: order._id.toString(),
      order_date: new Date(),
      billing_customer_name: order.customer.name,
      billing_last_name: ".", // required field
      billing_address: order.customer.address,
      billing_city: order.customer.city,
      billing_pincode: order.customer.pincode,
      billing_state: "Telangana", // change to your real state
      billing_country: "India",
      billing_phone: order.customer.phone,
      shipping_is_billing: true,
      payment_method: "Prepaid",
      order_items: orderItems,
      payment_method: "Prepaid",
      sub_total: order.amount,
      weight: 0.5,     // in KG (MANDATORY)
      length: 10,      // in CM
      breadth: 10,     // in CM
      height: 5        // in CM
    };

    console.log("[Shiprocket] Creating order with payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("[Shiprocket] Order created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("[Shiprocket] Error creating order:", error.response?.data || error.message);
    throw error;
  }
};