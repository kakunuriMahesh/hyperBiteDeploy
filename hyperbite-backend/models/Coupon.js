const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['offer', 'referral', 'collaborator', 'retail'],
    required: true,
    default: 'offer',
  },
  discount: {
    type: Number,
    default: 0,
  },
  freeShipping: {
    type: Boolean,
    default: false,
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  maxUses: {
    type: Number,
    default: null,
  },
  currentUses: {
    type: Number,
    default: 0,
  },
  perCustomerLimit: {
    type: Number,
    default: 1,
  },
  minCartValue: {
    type: Number,
    default: 0,
  },
  maxCartValue: {
    type: Number,
    default: 0,
  },
  prefix: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

couponSchema.index({ code: 1 });
couponSchema.index({ type: 1, agentId: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
