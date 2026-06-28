const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, default: null },
    stockStatus: { type: String, enum: ['Available', 'Not Available'], default: 'Available' },
    image: { type: String, default: '' },
    images: [{ type: String }],
    ingredients: [{ type: String }],
    benefits: [{ type: String }],
    nutritionalInfo: {
      servingSize: { type: String, default: '' },
      calories: { type: String, default: '' },
      protein: { type: String, default: '' },
      fat: { type: String, default: '' },
      carbs: { type: String, default: '' },
      fiber: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
