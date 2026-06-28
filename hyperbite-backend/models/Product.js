const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, unique: true, sparse: true },
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

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

productSchema.pre('save', async function (next) {
  if (!this.slug || this.isModified('name')) {
    let baseSlug = slugify(this.name || 'product');
    let candidate = baseSlug;
    let count = 1;
    // eslint-disable-next-line no-undef
    while (await mongoose.model('Product').exists({ slug: candidate, _id: { $ne: this._id } })) {
      candidate = `${baseSlug}-${count}`;
      count++;
    }
    this.slug = candidate;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
