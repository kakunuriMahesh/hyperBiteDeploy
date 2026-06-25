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
    enum: ['discount_percent', 'reward_points', 'free_shipping'],
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
    enum: ['spin', 'purchase'],
    default: 'spin',
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null,
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

module.exports = mongoose.model('Reward', rewardSchema);
