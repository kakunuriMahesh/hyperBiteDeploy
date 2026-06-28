const API_BASE = import.meta.env.VITE_API_URL || 'https://hyperbitedeploy.onrender.com';

const reviews = {
  'millet-matrix': [
    { id: 1, name: 'Arun Sharma', rating: 5, comment: 'Excellent millet mix! So nutritious and tasty. Perfect addition to my morning smoothie or yogurt.' },
    { id: 2, name: 'Priya Patel', rating: 5, comment: 'Love the variety of grains in this collection. Great source of protein and healthy fats.' },
    { id: 3, name: 'Ravi Kumar', rating: 4, comment: 'Good quality ingredients, very fresh. Great for adding to salads and baked goods.' },
  ],
  'oats-octane': [
    { id: 1, name: 'Lakshmi Iyer', rating: 5, comment: 'Excellent oat mix! So nutritious and tasty. Perfect for a quick energy boost.' },
    { id: 2, name: 'Vikram Singh', rating: 5, comment: 'Love the oats and seeds combination. Great source of sustained energy.' },
    { id: 3, name: 'Ananya Gupta', rating: 4, comment: 'Good quality oats, very fresh. Great for adding to smoothies.' },
  ],
  'cashew-charge': [
    { id: 1, name: 'Krishna Murthy', rating: 5, comment: 'Excellent cashew mix! Crunchy and delicious.' },
    { id: 2, name: 'Deepika Joshi', rating: 5, comment: 'Love the cinnamon profile. Great gourmet snack.' },
    { id: 3, name: 'Suresh Nair', rating: 4, comment: 'Good quality cashews, very fresh and tasty.' },
  ],
  'seed-boost': [
    { id: 1, name: 'Kavita Deshmukh', rating: 5, comment: 'Excellent seed mix! So nutritious and tasty.' },
    { id: 2, name: 'Amit Kapoor', rating: 5, comment: 'Love the variety of seeds. Great source of protein.' },
    { id: 3, name: 'Pooja Mehta', rating: 4, comment: 'Good quality seeds, very fresh.' },
  ],
  'power-pulse': [
    { id: 1, name: 'Rajesh Iyer', rating: 5, comment: 'Excellent protein bite! Tastes amazing.' },
    { id: 2, name: 'Devi Narayanan', rating: 5, comment: 'Love the dark chocolate and orange zest combination.' },
    { id: 3, name: 'Manish Yadav', rating: 4, comment: 'Great post-workout recovery snack.' },
  ],
};

export async function fetchProductsFromAPI() {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  const arr = Array.isArray(data) ? data : [];
  const map = {};
  arr.forEach((p) => {
    const slug = p.slug || p.name?.toLowerCase().replace(/\s+/g, '-');
    const productReviews = reviews[slug] || [];
    const fmtPrice = (val) => val != null ? `₹${val}` : '';
    map[slug] = { ...p, id: p._id || slug, slug, packImg: p.image || '', stock: p.stockStatus || 'Available', price: fmtPrice(p.price), compareAtPrice: fmtPrice(p.compareAtPrice), reviews: productReviews, reviewCount: productReviews.length };
    map[p._id] = map[slug];
  });
  return map;
}
