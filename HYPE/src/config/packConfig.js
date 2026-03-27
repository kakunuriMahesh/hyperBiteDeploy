// Pack configurations for combo products
export const packConfigs = {
  pack250: {
    id: 'pack250',
    name: 'The Discovery Pack',
    availableStatus:"",
    price: 300,
    offPrice: 350,
    discount: '8%',
    isCustomizable: false,
    minAmount: 0,
    description: 'Pre-selected mix of premium products prepared by us',
    defaultProducts: [
      { id: 'nuts', quantity: 0.5 },
      { id: 'dates', quantity: 0.3 },
      { id: 'seeds', quantity: 0.2 }
    ],
    image: '/assets/CustomizePack.jpeg',
    badge: 'Default Pack',
    // details content
    detailsContent: {
    title: 'The Discovery Pack (10 Pcs)',
    subtitle: 'New to HyperBite? This is where you begin.',
    whatsInside: [
      '5 Signature SKUs (2 pieces each).',
      '10 Total Pouches in a curated, fixed combo.',
      'Zero Decision Fatigue: We’ve already picked the best for you.'
    ],
    whyYoullLoveIt: [
      'Perfect for first-time users to find their favorites.',
      'Covers a balanced range of taste, nutrition, and energy.',
      'Price: ₹300 (Inclusive of all taxes).'
    ],
    footer: 'Free Home Delivery. No extra cost. No hidden charges.'
  }
  },
  pack500: {
    id: 'pack500',
    name: 'Build Your Snack Box',
    availableStatus:"",
    price: 499,
    allowPacksCount: 18,
    maxItems: 18,
    minPrice: 499,
    maxPrice: 540,
    offPrice: 540,
    discount: '8%',
    isCustomizable: true,
    minAmount: 499,
    description: 'Create your custom pack by selecting products',
    defaultProducts: [],
    image: '/assets/CustomizePack.jpeg',
    badge: 'Customized Pack',
    // details content
    detailsContent: {
    title: 'Build Your Snack Box (18 Pcs)',
    subtitle: 'Once you know what you love, why settle for fixed combos?',
    whatsInside: [
      'Browse all available pouches.',
      'Drag & Drop your favorites into the box.',
      'Mix & Match until you hit 18 pouches.'
    ],
    // keeping SAME KEY (mapped from "Exclusive Perks")
    whyYoullLoveIt: [
      'Instant Savings: Pay ₹499 (Save ₹41 vs MRP).',
      'Free Gift: 1 Sachet of Green Vital Mix from SaptaPoshaka.',
      'Hyper Points: +499 points added to your account for future gifts.',
      'Complete control over flavors and quantity.',
      'The best value for regular snackers.',
      'Fun, interactive customizer experience.'
    ],
    footer: ''
  }
  },
  pack1450: {
    id: 'pack1450',
    name: 'The Mega Box',
    availableStatus:"Out of Stock",
    price: 1440,
    allowPacksCount: 40,
    maxItems: 40,
    minPrice: 1440,
    maxPrice: 1540,
    offPrice: 1750,
    discount: '17%',
    isCustomizable: true,
    minAmount: 1440,
    description: 'Premium selection with maximum customization',
    defaultProducts: [],
    image: '/assets/CustomizePack.jpeg',
    badge: 'Customized Pack',
    // details content
    detailsContent: {
    title: 'The Mega Box (40 Pcs)',
    subtitle: 'For the true HyperBite enthusiast who wants it all.',
    whatsInside: [
      'A massive collection of 40 pouches.',
      'Mix & Match any combination you desire.',
      'Perfect for families, offices, or long-term snacking.'
    ],
    whyYoullLoveIt: [
      'Maximum Savings: Pay ₹1440 (Save ₹310 vs MRP).',
      'Free Gift: 1 Sachet of Green Vital Mix + 1 Sachet of Energy Booster.',
      'Hyper Points: +1440 points for your next big haul.',
      'Unbeatable value for bulk snacking.',
      'Endless variety to keep your taste buds excited.'
    ],
    footer: ''
  }
  }
};

// Get all packs as array
export const getAllPacks = () => Object.values(packConfigs);
