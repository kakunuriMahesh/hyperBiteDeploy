const mongoose = require('mongoose');

const segmentSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  type: {
    type: String,
    enum: ['discount_percent', 'reward_points', 'free_shipping', 'none'],
    required: true,
  },
  weight: { type: Number, required: true, min: 0 },
  color: { type: String, required: true },
}, { _id: false });

const spinConfigSchema = new mongoose.Schema({
  name: { type: String, default: 'Default Spin Wheel' },
  segments: { type: [segmentSchema], required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('SpinConfig', spinConfigSchema);
