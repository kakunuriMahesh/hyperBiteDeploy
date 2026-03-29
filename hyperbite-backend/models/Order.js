const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    phone: String,
    whatsapp: String,
    address: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },
  
  items: [
    {
      productId: String,
      id: String,
      name: String,
      price: Number,
      quantity: Number,
      type: { type: String, enum: ["product", "pack"], default: "product" },
      subItems: [
        {
          id: String,
          name: String,
          quantity: Number,
        }
      ],
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