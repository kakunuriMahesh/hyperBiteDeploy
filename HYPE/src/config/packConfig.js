// Pack configurations for combo products
export const packConfigs = {
  pack250: {
    id: 'pack250',
    name: 'Starter Pack',
    price: 250,
    offPrice: 300,
    discount: '17%',
    isCustomizable: false,
    minAmount: 0,
    description: 'Pre-selected mix of premium products prepared by us',
    defaultProducts: [
      { id: 'nuts', quantity: 0.5 },
      { id: 'dates', quantity: 0.3 },
      { id: 'seeds', quantity: 0.2 }
    ],
    image: '/assets/combo-pack-250.png',
    badge: 'Default Pack',
  },
  pack500: {
    id: 'pack500',
    name: 'Premium Pack',
    price: 500,
    allowPacksCount: 18,
    maxItems: 18,
    minPrice: 500,
    maxPrice: 600,
    offPrice: 600,
    discount: '17%',
    isCustomizable: true,
    minAmount: 500,
    description: 'Create your custom pack by selecting products',
    defaultProducts: [],
    image: '/assets/combo-pack-500.png',
    badge: 'Customized Pack',
  },
  pack1450: {
    id: 'pack1450',
    name: 'Deluxe Pack',
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
    image: '/assets/combo-pack-1450.png',
    badge: 'Customized Pack',
  }
};

// Get all packs as array
export const getAllPacks = () => Object.values(packConfigs);
