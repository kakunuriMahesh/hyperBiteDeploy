const API_BASE = import.meta.env.VITE_API_URL || 'https://hyperbitedeploy.onrender.com';

// Product details for each product type
export const productDetails = {
    milletMatrix:{
  id: 'milletMatrix',
  name: 'Millet Matrix',
  stock: 'Available',
  description: 'Ancient Grains for Modern Endurance An authentic experience of ancient wisdom, combining Raagi, Sajja, Korra, and Jonnalu. Sweetened only with Raw Honey and Dates.',
  ingredients: [
    'Foxtail Millet',
    'Kodo Millet',
    'Sunflower Seeds',
    'Pumpkin Seeds',
    'Chia Seeds'
  ],
  benefits: [
    'High in fiber',
    'Rich in antioxidants',
    'Supports digestive health',
    'Gluten-free',
    'Sustained energy release'
  ],
  nutritionalInfo: {
    servingSize: '30g',
    calories: '150',
    protein: '5g',
    fat: '8g',
    carbs: '15g',
    fiber: '4g'
  },
  price: '30 RS',
  image: '/assets/Millet_pack.webp',
  packImg: '/assets/Millet_pack.webp',
  images: [
    '/assets/Millet_pack.webp',
    '/assets/milletMatrix-mock.jpeg', 
    '/assets/MilletMixHoney.jpeg',
    '/assets/Millet_pack.webp'
  ],
  reviews: [
    {
      id: 1,
      name: 'Noor Al-Mansoori',
      rating: 5,
      comment: 'Excellent seed mix! So nutritious and tasty. Perfect addition to my morning smoothie or yogurt.'
    },
    {
      id: 2,
      name: 'Khalid Al-Zahra',
      rating: 5,
      comment: 'Love the variety of seeds in this collection. Great source of protein and healthy fats. Highly recommended!'
    },
    {
      id: 3,
      name: 'Aisha Mohammed',
      rating: 4,
      comment: 'Good quality seeds, very fresh. Great for adding to salads and baked goods. Very satisfied!'
    }
  ],
  reviewCount: 156
},
oatsOctane:{
  id: 'oatsOctane',
  name: 'Oats Octane',
  stock: 'Available',
  description: 'The Sustained Energy Engine A high-performance mix of Rolled Oats, Sunflower & Pumpkin seeds, Roasted Peanuts and Raw Honey.',
  ingredients: [
    'Foxtail Millet',
    'Kodo Millet',
    'Sunflower Seeds',
    'Pumpkin Seeds',
    'Chia Seeds'
  ],
  benefits: [
    'High in fiber',
    'Rich in antioxidants',
    'Supports digestive health',
    'Gluten-free',
    'Sustained energy release'
  ],
  nutritionalInfo: {
    servingSize: '30g',
    calories: '150',
    protein: '5g',
    fat: '8g',
    carbs: '15g',
    fiber: '4g'
  },
  price: '30 RS',
  image: '/assets/Oat_Pack.webp',
  packImg: '/assets/Oat_Pack.webp',
  images: [
    '/assets/Oat_Pack.webp',
    '/assets/oatsOctane-mock.jpeg',
    '/assets/OatsOctaneHoney.jpeg',
    '/assets/Oat_Pack.webp', 
  ],
  reviews: [
    {
      id: 1,
      name: 'Noor Al-Mansoori',
      rating: 5,
      comment: 'Excellent seed mix! So nutritious and tasty. Perfect addition to my morning smoothie or yogurt.'
    },
    {
      id: 2,
      name: 'Khalid Al-Zahra',
      rating: 5,
      comment: 'Love the variety of seeds in this collection. Great source of protein and healthy fats. Highly recommended!'
    },
    {
      id: 3,
      name: 'Aisha Mohammed',
      rating: 4,
      comment: 'Good quality seeds, very fresh. Great for adding to salads and baked goods. Very satisfied!'
    }
  ],
  reviewCount: 156
},
cashewCharge:{
  id: 'cashewCharge',
  name: 'Cashew Charge',
  description: 'The Gourmet Junk-Food Killer Fresh, high-quality cashews roasted in allowable ghee and seasoned with a bold Cinnamon profile.',
  stock: 'Available',
  ingredients: [
    'Foxtail Millet',
    'Kodo Millet',
    'Sunflower Seeds',
    'Pumpkin Seeds',
    'Chia Seeds'
  ],
  benefits: [
    'High in fiber',
    'Rich in antioxidants',
    'Supports digestive health',
    'Gluten-free',
    'Sustained energy release'
  ],
  nutritionalInfo: {
    servingSize: '30g',
    calories: '150',
    protein: '5g',
    fat: '8g',
    carbs: '15g',
    fiber: '4g'
  },
  price: '30 RS',
  image: '/assets/Cashew_pack.webp',
  packImg: '/assets/Cashew_pack.webp',
  images: [
    '/assets/Cashew_pack.webp',
    '/assets/cashew_charge-mock.jpeg',
    '/assets/cashew_charge-mock2.jpeg',
    '/assets/Cashew_pack.webp'
  ],
  reviews: [
    {
      id: 1,
      name: 'Noor Al-Mansoori',
      rating: 5,
      comment: 'Excellent seed mix! So nutritious and tasty. Perfect addition to my morning smoothie or yogurt.'
    },
    {
      id: 2,
      name: 'Khalid Al-Zahra',
      rating: 5,
      comment: 'Love the variety of seeds in this collection. Great source of protein and healthy fats. Highly recommended!'
    },
    {
      id: 3,
      name: 'Aisha Mohammed',
      rating: 4,
      comment: 'Good quality seeds, very fresh. Great for adding to salads and baked goods. Very satisfied!'
    }
  ],
  reviewCount: 156
},
seedBoost:{
  id: 'seedBoost',
  name: 'Seed Boost',
  description: 'The Micronutrient Powerhouse A savory, crunchy blend of Sunflower, Pumpkin, and Watermelon seeds, lightly roasted in premium ghee with a hint of cinnamon and secret spices.',
  stock: 'Available',
  ingredients: [
    'Foxtail Millet',
    'Kodo Millet',
    'Sunflower Seeds',
    'Pumpkin Seeds',
    'Chia Seeds'
  ],
  benefits: [
    'High in fiber',
    'Rich in antioxidants',
    'Supports digestive health',
    'Gluten-free',
    'Sustained energy release'
  ],
  nutritionalInfo: {
    servingSize: '30g',
    calories: '150',
    protein: '5g',
    fat: '8g',
    carbs: '15g',
    fiber: '4g'
  },
  price: '30 RS',
  image: '/assets/Seed_pack.webp',
  packImg: '/assets/Seed_pack.webp',
  images: [
    '/assets/Seed_pack.webp',
    '/assets/seedboost-mock.jpeg',
    '/assets/seedboost-mocke.jpeg',
    '/assets/Seed_pack.webp'
  ],
  reviews: [
    {
      id: 1,
      name: 'Noor Al-Mansoori',
      rating: 5,
      comment: 'Excellent seed mix! So nutritious and tasty. Perfect addition to my morning smoothie or yogurt.'
    },
    {
      id: 2,
      name: 'Khalid Al-Zahra',
      rating: 5,
      comment: 'Love the variety of seeds in this collection. Great source of protein and healthy fats. Highly recommended!'
    },
    {
      id: 3,
      name: 'Aisha Mohammed',
      rating: 4,
      comment: 'Good quality seeds, very fresh. Great for adding to salads and baked goods. Very satisfied!'
    }
  ],
  reviewCount: 156
},
powerChunk:{
  id: 'powerChunk',
  name: 'Power Pulse',
  description: 'The High-Protein Recovery Bite A potent blend of Dates, Nuts, Hemp Protein powder and Dark Chocolate, finished with a refreshing Orange zest.',
  stock:'Not Available',
  ingredients: [
    'Foxtail Millet',
    'Kodo Millet',
    'Sunflower Seeds',
    'Pumpkin Seeds',
    'Chia Seeds'
  ],
  benefits: [
    'High in fiber',
    'Rich in antioxidants',
    'Supports digestive health',
    'Gluten-free',
    'Sustained energy release'
  ],
  nutritionalInfo: {
    servingSize: '30g',
    calories: '150',
    protein: '5g',
    fat: '8g',
    carbs: '15g',
    fiber: '4g'
  },
  price: '30 RS',
  image: '/assets/Power_pack.webp',
  packImg: '/assets/Power_pack.webp',
  images: [
    '/assets/Power_pack.webp',
    '/assets/powerChunk-mock.jpeg',
    '/assets/powerChunk-mock2.jpeg',
    '/assets/Power_pack.webp'
  ], 
  reviews: [
    {
      id: 1,
      name: 'Noor Al-Mansoori',
      rating: 5,
      comment: 'Excellent seed mix! So nutritious and tasty. Perfect addition to my morning smoothie or yogurt.'
    },
    {
      id: 2,
      name: 'Khalid Al-Zahra',
      rating: 5,
      comment: 'Love the variety of seeds in this collection. Great source of protein and healthy fats. Highly recommended!'
    },
    {
      id: 3,
      name: 'Aisha Mohammed',
      rating: 4,
      comment: 'Good quality seeds, very fresh. Great for adding to salads and baked goods. Very satisfied!'
    }
  ],
  reviewCount: 156
},
};

/**
 * Fetch products from the backend API and merge with hardcoded productDetails.
 * API data overrides image, price, stock for products matching by slug/name.
 * Returns the merged productDetails map (keyed by the same IDs as hardcoded).
 */
export async function fetchProductsFromAPI() {
  try {
    const res = await fetch(`${API_BASE}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const apiProducts = await res.json();
    if (!apiProducts || apiProducts.length === 0) return { ...productDetails };

    const merged = { ...productDetails };

    // Build a name-to-id map from the hardcoded config for matching
    const nameToId = {};
    Object.entries(productDetails).forEach(([id, p]) => {
      nameToId[p.name?.toLowerCase()] = id;
      nameToId[p.slug?.toLowerCase()] = id;
    });

    apiProducts.forEach((apiP) => {
      const slug = apiP.slug?.toLowerCase();
      const name = apiP.name?.toLowerCase();
      // Try matching by slug first, then by name
      const matchId = nameToId[slug] || nameToId[name];

      if (matchId && merged[matchId]) {
        // Override fields from API, keeping the original id key
        merged[matchId] = {
          ...merged[matchId],
          image: apiP.image || merged[matchId].image,
          packImg: apiP.image || merged[matchId].packImg || merged[matchId].image,
          images: apiP.images?.length ? apiP.images : merged[matchId].images,
          price: apiP.price ? `₹${apiP.price}` : merged[matchId].price,
          stock: apiP.stockStatus || merged[matchId].stock,
          ingredients: apiP.ingredients?.length ? apiP.ingredients : merged[matchId].ingredients,
          benefits: apiP.benefits?.length ? apiP.benefits : merged[matchId].benefits,
          nutritionalInfo: apiP.nutritionalInfo?.servingSize ? apiP.nutritionalInfo : merged[matchId].nutritionalInfo,
          description: apiP.description || merged[matchId].description,
        };
      } else {
        // New product from API — key by slug
        merged[slug] = {
          id: slug,
          name: apiP.name,
          slug: apiP.slug,
          stock: apiP.stockStatus || 'Available',
          description: apiP.description || '',
          ingredients: apiP.ingredients || [],
          benefits: apiP.benefits || [],
          nutritionalInfo: apiP.nutritionalInfo || {},
          price: apiP.price ? `₹${apiP.price}` : '',
          image: apiP.image || '',
          packImg: apiP.image || '',
          images: apiP.images || [],
          reviews: [],
          reviewCount: 0,
        };
      }
    });

    return merged;
  } catch {
    return { ...productDetails };
  }
}