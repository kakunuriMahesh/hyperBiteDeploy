const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: '',
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  whatsapp: {
    type: String,
    trim: true,
    default: '',
  },
  city: {
    type: String,
    trim: true,
    default: '',
  },
  referralCode: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true,
  },
  personalCode: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true,
  },
  monthlyPackLimit: {
    type: Number,
    default: 1,
  },
  packsUsedThisMonth: {
    type: Number,
    default: 0,
  },
  totalReferrals: {
    type: Number,
    default: 0,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  rewardPoints: {
    type: Number,
    default: 0,
  },
  rewardPointsPerReferral: {
    type: Number,
    default: 100,
  },
  personalDiscountPercent: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

agentSchema.index({ referralCode: 1 });
agentSchema.index({ personalCode: 1 });

module.exports = mongoose.model('Agent', agentSchema);
