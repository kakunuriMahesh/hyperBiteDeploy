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
    const { customer, items } = req.body;

    console.log("[PaymentController] createOrder payload", JSON.stringify(req.body));

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
      customer: {
        name: customer?.name || "",
        email: customer?.email || "",
        phone: customer?.phone || "",
        whatsapp: customer?.whatsapp || "",
        address: customer?.address || "",
        city: customer?.city || "",
        state: customer?.state || "",
        country: customer?.country || "",
        pincode: customer?.pincode || "",
      },
      items,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "pending"
    });

    console.log("[PaymentController] Order created", JSON.stringify(order));

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
        { returnDocument: 'after' } // use modern option
      );

      console.log("[PaymentController] Order updated - Payment Status: paid");

      // if payment succeeded trigger Shiprocket
      if (updated) {
        try {
          console.log("[PaymentController] Triggering Shiprocket order creation...");
          const result = await shiprocketController.createShiprocketOrder(updated);
          console.log("[PaymentController] Shiprocket order created successfully");

          // Save ShipRocket response to prevent cron from double-processing
          await Order.findByIdAndUpdate(updated._id, {
            $set: {
              shipmentStatus: "CREATED",
              shiprocketShipmentId: result.shipment_id || result.id,
              courierName: result.courier_name,
              awbCode: result.awb_code,
              trackingUrl: result.tracking_url,
              shiprocketCreatedAt: new Date()
            }
          });
        } catch (err) {
          console.error("[PaymentController] Shiprocket trigger failed:", err.message || err);
          // Cron will pick this up and retry since shipmentStatus stays PENDING
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