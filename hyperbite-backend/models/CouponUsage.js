const mongoose = require('mongoose');

const couponUsageSchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: true,
  },
  code: {
    type: String,
    required: true,
    uppercase: true,
  },
  type: {
    type: String,
    enum: ['offer', 'referral', 'collaborator'],
    required: true,
  },
  customerIdentifier: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    default: null,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  usedAt: {
    type: Date,
    default: Date.now,
  },
});

couponUsageSchema.index({ couponId: 1 });
couponUsageSchema.index({ agentId: 1 });
couponUsageSchema.index({ customerIdentifier: 1 });
couponUsageSchema.index({ orderId: 1 });

module.exports = mongoose.model('CouponUsage', couponUsageSchema);
