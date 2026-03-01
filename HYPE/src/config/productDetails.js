// Product details for each product type
export const productDetails = {
  nuts: {
    id: 'nuts',
    name: 'Nuts Mix',
    description: 'Premium mixed nuts collection packed with natural goodness and essential nutrients.',
    ingredients: [
      'Almonds',
      'Walnuts',
      'Cashews',
      'Pistachios',
      'Hazelnuts',
      'Pumpkin Seeds',
      'Sunflower Seeds'
    ],
    benefits: [
      'Rich in healthy fats and omega-3',
      'High protein content for energy',
      'Packed with vitamins and minerals',
      'Supports heart health',
      'Natural source of antioxidants',
      'Helps maintain healthy weight'
    ],
    nutritionalInfo: {
      servingSize: '30g',
      calories: '180',
      protein: '6g',
      fat: '15g',
      carbs: '5g',
      fiber: '3g'
    },
    price: '30 RS',
    image: '/assets/wallnut.webp',
    packImg:'/assets/SeedMixPackImg.jpeg',
    images: [
      '/assets/wallnut.webp',
      '/assets/pumpkinseed.webp',
      '/assets/sunflowerseed.webp',
      '/assets/dateorange.webp'
    ],
    reviews: [
      {
        id: 1,
        name: 'Sarah Ahmed',
        rating: 5,
        comment: 'Absolutely love this mix! Perfect combination of flavors and so fresh. Great for snacking anytime.'
      },
      {
        id: 2,
        name: 'Mohammed Ali',
        rating: 5,
        comment: 'Best nuts I\'ve ever had. High quality and delicious. Highly recommend to everyone!'
      },
      {
        id: 3,
        name: 'Fatima Hassan',
        rating: 4,
        comment: 'Great product! Very nutritious and tasty. The packaging keeps them fresh for a long time.'
      }
    ],
    reviewCount: 230
  },
  dates: {
    id: 'dates',
    name: 'Dates',
    description: 'Fresh organic dates, nature\'s sweetest gift packed with energy and tradition.',
    ingredients: [
      '100% Organic Dates',
      'No Added Sugars',
      'No Preservatives',
      'Natural Sweetness'
    ],
    benefits: [
      'Natural energy boost',
      'High in fiber for digestion',
      'Rich in potassium and magnesium',
      'Antioxidant properties',
      'Supports bone health',
      'Natural sweetener alternative'
    ],
    nutritionalInfo: {
      servingSize: '100g',
      calories: '277',
      protein: '1.8g',
      fat: '0.2g',
      carbs: '75g',
      fiber: '6.7g'
    },
    price: '35 RS',
    image: '/assets/date.webp',
    packImg:'/assets/DatePackImg.jpeg',
    images: [
      '/assets/date.webp',
      '/assets/dateorange.webp',
      '/assets/date.webp',
      '/assets/date.webp'
    ],
    reviews: [
      {
        id: 1,
        name: 'Ahmed Khalid',
        rating: 5,
        comment: 'These dates are incredibly fresh and sweet! Perfect natural snack. My family loves them.'
      },
      {
        id: 2,
        name: 'Layla Ibrahim',
        rating: 5,
        comment: 'Amazing quality dates! So soft and delicious. Great source of natural energy throughout the day.'
      },
      {
        id: 3,
        name: 'Omar Abdullah',
        rating: 4,
        comment: 'Very good dates, authentic taste. Perfect for breaking fast or as a healthy snack anytime.'
      }
    ],
    reviewCount: 187
  },
  seeds: {
    id: 'seeds',
    name: 'Seeds Collection',
    description: 'Small seeds, mighty nutrition for your wellness journey. Premium collection of nutritious seeds.',
    ingredients: [
      'Sunflower Seeds',
      'Pumpkin Seeds',
      'Chia Seeds',
      'Flax Seeds',
      'Sesame Seeds',
      'Hemp Seeds'
    ],
    benefits: [
      'High in protein and fiber',
      'Rich in omega-3 fatty acids',
      'Packed with essential vitamins',
      'Supports digestive health',
      'Boosts immune system',
      'Natural source of minerals'
    ],
    nutritionalInfo: {
      servingSize: '30g',
      calories: '160',
      protein: '8g',
      fat: '12g',
      carbs: '4g',
      fiber: '4g'
    },
    price: '40 RS',
    image: '/assets/sunflowerseed.webp',
    packImg:'/assets/DarkChocoPackImg.jpeg',
    images: [
      '/assets/sunflowerseed.webp',
      '/assets/pumpkinseed.webp',
      '/assets/sunflowershell.webp',
      '/assets/sunflowerseed.webp'
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
  }
};

