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
    console.log('[Shiprocket] Order customer details:', {
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone,
      whatsapp: order.customer.whatsapp,
      address: order.customer.address,
      city: order.customer.city,
      state: order.customer.state,
      country: order.customer.country,
      pincode: order.customer.pincode
    });

    // Build detailed order_items: expand packs into individual sub-items
    let orderItems = [];
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
      order.items.forEach((item) => {
        if (item.type === "pack" && item.subItems && item.subItems.length > 0) {
          // Group pack as a single line item with ingredients listed in the name
          const ingredientsList = item.subItems
            .map((sub) => `${sub.name} ×${(sub.quantity || 1) * (item.quantity || 1)}`)
            .join(", ");

          orderItems.push({
            name: `${item.name} [${ingredientsList}]`,
            sku: item.id || `PACK-${item.name}`,
            units: item.quantity || 1,
            selling_price: item.price || 0,
          });
        } else {
          // Regular product item
          orderItems.push({
            name: item.name || "Product",
            sku: item.productId || item.id || `SKU-${item.name}`,
            units: item.quantity || 1,
            selling_price: item.price || 0,
          });
        }
      });
    } else {
      // Fallback if items not available
      orderItems = [
        {
          name: "Order Items",
          sku: "GENERAL",
          units: 1,
          selling_price: order.totalAmount || 0
        }
      ];
    }

    // Calculate weight based on total units (approx 50g per unit)
    const totalUnits = orderItems.reduce((sum, oi) => sum + (oi.units || 1), 0);
    const estimatedWeight = Math.max(0.5, Math.round(totalUnits * 0.05 * 10) / 10); // min 0.5 KG

    const payload = {
      order_id: order._id.toString(),
      order_date: new Date(),
      billing_customer_name: order.customer.name,
      billing_last_name: ".", // required field
      billing_address: order.customer.address,
      billing_city: order.customer.city,
      billing_pincode: order.customer.pincode,
      billing_state: order.customer.state,
      billing_country: order.customer.country,
      billing_email: order.customer.email,
      billing_phone: order.customer.phone,
      shipping_is_billing: true,
      payment_method: "Prepaid",
      order_items: orderItems,
      // some payloads come with totalAmount, others with amount
      sub_total: order.totalAmount || order.amount || 0,
      weight: estimatedWeight,  // in KG (dynamic based on items)
      length: 20,               // in CM
      breadth: 15,              // in CM
      height: 10                // in CM
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