const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const shiprocketController = require("./shiprocketController");

// utility to compute total from items
function calculateTotal(items = []) {
  let total = 0;
  items.forEach(i => {
    total += (i.price || 0) * (i.quantity || 1);
  });
  return total;
}

exports.createOrder = async (req, res) => {
  try {
    const { customerName, email, phone, address, items, city, pincode } = req.body;

    const totalAmount = calculateTotal(items);

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    const order = await Order.create({
      customerName,
      email,
      phone,
      address,
      city,
      pincode,
      items,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending"
    });

    res.json({
      razorpayOrder,
      orderId: order._id,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("createOrder error", error);
    res.status(500).json({ error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log("[PaymentController] Payment verified for order:", razorpay_order_id);

      const updated = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: "paid",
          razorpayPaymentId: razorpay_payment_id
        },
        { new: true }
      );

      console.log("[PaymentController] Order updated - Payment Status: paid");

      // if payment succeeded trigger Shiprocket
      if (updated) {
        try {
          console.log("[PaymentController] Triggering Shiprocket order creation...");
          await shiprocketController.createShiprocketOrder(updated);
          console.log("[PaymentController] Shiprocket order created successfully");
        } catch (err) {
          console.error("[PaymentController] Shiprocket trigger failed:", err.message || err);
        }
      } else {
        console.warn("[PaymentController] Order not found for update:", razorpay_order_id);
      }

      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error("verifyPayment error", error);
    res.status(500).json({ error: error.message });
  }
};