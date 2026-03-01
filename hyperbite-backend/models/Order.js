const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  pincode: String,

  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    }
  ],

  totalAmount: Number,

  razorpayOrderId: String,
  razorpayPaymentId: String,

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  orderStatus: {
    type: String,
    enum: ["placed", "processing", "shipped", "delivered"],
    default: "placed"
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);