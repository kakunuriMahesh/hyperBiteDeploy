const mongoose = require('mongoose');

const packSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    offPrice: { type: Number, default: 0 },
    discount: { type: String, default: '' },
    isCustomizable: { type: Boolean, default: false },
    defaultProducts: [
      {
        id: { type: String, default: '' },
        name: { type: String, default: '' },
        quantity: { type: Number, default: 1 },
      },
    ],
    maxItems: { type: Number, default: 0 },
    minPrice: { type: Number, default: 0 },
    maxPrice: { type: Number, default: 0 },
    minAmount: { type: Number, default: 0 },
    allowPacksCount: { type: Number, default: 0 },
    availableStatus: { type: String, default: '' }, // '' = In Stock, 'Out of Stock'
    image: { type: String, default: '' },
    badge: { type: String, default: '' },
    freepack: {
      name: { type: String, default: '' },
      image: { type: String, default: '' },
      quantity: { type: Number, default: 1 },
    },
    detailsContent: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      whatsInside: [{ type: String }],
      whyYoullLoveIt: [{ type: String }],
      footer: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pack', packSchema);
