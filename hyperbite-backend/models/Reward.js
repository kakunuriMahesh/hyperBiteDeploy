const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['discount_percent', 'discount_fixed', 'reward_points', 'free_shipping', 'none'],
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    enum: ['spin', 'purchase', 'admin', 'manual'],
    default: 'manual',
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null,
  },
  minCartValue: {
    type: Number,
    default: 0,
  },
  maxCartValue: {
    type: Number,
    default: 0,
  },
  maxUses: {
    type: Number,
    default: null,
  },
  currentUses: {
    type: Number,
    default: 0,
  },
  claimed: {
    type: Boolean,
    default: false,
  },
  claimedAt: {
    type: Date,
    default: null,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

rewardSchema.index({ identifier: 1 });
rewardSchema.index({ claimed: 1, expiresAt: 1 });
rewardSchema.index({ source: 1 });
rewardSchema.index({ orderId: 1 });
rewardSchema.index({ currentUses: 1, maxUses: 1 }); // Supports $expr query in lookupRewards

module.exports = mongoose.model('Reward', rewardSchema);
