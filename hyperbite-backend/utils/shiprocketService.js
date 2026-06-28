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

function sanitizePhone(phone) {
  // Strip everything except digits, then take the last 10
  const digits = (phone || '').replace(/\D/g, '');
  return digits.slice(-10);
}

function sanitizePincode(pincode) {
  const digits = (pincode || '').replace(/\D/g, '');
  return digits.slice(0, 6);
}

function splitName(fullName) {
  // Shiprocket expects first name (billing_customer_name) and last name (billing_last_name)
  const parts = (fullName || '').trim().split(/\s+/);
  const first = parts[0] || '';
  const last = parts.length > 1 ? parts.slice(1).join(' ') : '.';
  return { first, last };
}

exports.createShiprocketOrder = async (order) => {
  try {
    console.log("[Shiprocket] Generating token...");
    const token = await generateToken();
    console.log("[Shiprocket] Token generated successfully");

    // Sanitize customer fields for Shiprocket API requirements
    const phone = sanitizePhone(order.customer.phone);
    const pincode = sanitizePincode(order.customer.pincode);
    const { first: firstName, last: lastName } = splitName(order.customer.name);

    console.log('[Shiprocket] Sanitized customer:', { name: firstName, lastName, phone, pincode });

    // Build detailed order_items: expand packs into individual sub-items
    let orderItems = [];
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
      order.items.forEach((item) => {
        if (item.type === "pack" && item.subItems && item.subItems.length > 0) {
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
          orderItems.push({
            name: item.name || "Product",
            sku: item.productId || item.id || `SKU-${item.name}`,
            units: item.quantity || 1,
            selling_price: item.price || 0,
          });
        }
      });
    } else {
      orderItems = [
        {
          name: "Order Items",
          sku: "GENERAL",
          units: 1,
          selling_price: Number(order.totalAmount || order.amount || 0),
        }
      ];
    }

    const totalUnits = orderItems.reduce((sum, oi) => sum + (oi.units || 1), 0);
    const estimatedWeight = Math.max(0.5, Math.round(totalUnits * 0.05 * 10) / 10);

    const payload = {
      order_id: order._id.toString(),
      order_date: new Date(),
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: order.customer.address || '',
      billing_city: order.customer.city || '',
      billing_pincode: pincode,
      billing_state: order.customer.state || '',
      billing_country: order.customer.country || '',
      billing_phone: phone,
      shipping_is_billing: true,
      payment_method: "Prepaid",
      order_items: orderItems,
      sub_total: Number(order.totalAmount || order.amount || 0),
      weight: estimatedWeight,
      length: 20,
      breadth: 15,
      height: 10
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
    const errorBody = error.response?.data || {};
    const statusCode = error.response?.status || 0;
    console.error("[Shiprocket] Error creating order:", JSON.stringify({
      statusCode,
      message: errorBody.message || error.message,
      errors: errorBody.errors || errorBody,
    }));
    // Throw with the Shiprocket error detail so upstream catches can store it
    const enhanced = new Error(errorBody.message || error.message);
    enhanced.statusCode = statusCode;
    enhanced.shiprocketResponse = errorBody;
    throw enhanced;
  }
};
