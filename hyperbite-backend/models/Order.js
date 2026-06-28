const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    phone: String,
    email: String,
    address: String,
    city: String,
    state: String,
    country: String,
    pincode: String,
  },

  customerIdentifier: {
    type: String,
    lowercase: true,
    trim: true,
    default: null,
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
  finalAmount: Number,

  appliedReward: mongoose.Schema.Types.Mixed,
  appliedCoupon: mongoose.Schema.Types.Mixed,

  referralAgentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    default: null,
  },

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
  },

  // Shipment
  shipmentStatus: {
    type: String,
    enum: ["PENDING", "PROCESSING", "CREATED", "FAILED"],
    default: "PENDING"
  },
  shiprocketShipmentId: String,
  courierName: String,
  awbCode: String,
  trackingUrl: String,
  shiprocketError: String,
  shiprocketCreatedAt: Date,
  retryCount: { type: Number, default: 0 },
  lastAttemptedAt: Date

}, { timestamps: true });

orderSchema.index({ customerIdentifier: 1 });
orderSchema.index({ 'appliedCoupon.code': 1 });
orderSchema.index({ referralAgentId: 1 });

module.exports = mongoose.model("Order", orderSchema);