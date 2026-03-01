import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const Blog = () => {
  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const viewportWidth = window.innerWidth;
      if (viewportWidth < 768) {
        setBreakpoint('mobile');
      } else if (viewportWidth < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const blogPosts = [
    {
      id: 1,
      title: 'The Health Benefits of Mixed Nuts',
      date: 'March 15, 2024',
      excerpt: 'Discover the amazing health benefits of incorporating mixed nuts into your daily diet. Learn about the nutritional value and how they can improve your overall wellness.',
      content: 'Mixed nuts are a powerhouse of nutrition, packed with essential vitamins, minerals, and healthy fats. Regular consumption can help improve heart health, boost brain function, and provide sustained energy throughout the day. Our premium selection includes almonds, walnuts, cashews, and more, each offering unique health benefits.',
      category: 'Health & Wellness'
    },
    {
      id: 2,
      title: 'Why Dates Are Nature\'s Perfect Energy Source',
      date: 'March 10, 2024',
      excerpt: 'Explore why dates have been a staple food for centuries and how they provide natural, sustained energy without the crash of processed sugars.',
      content: 'Dates are one of nature\'s most perfect foods, offering a natural source of energy that has sustained people for thousands of years. Rich in fiber, potassium, and natural sugars, dates provide a quick energy boost while also supporting digestive health. They\'re perfect for athletes, busy professionals, and anyone looking for a healthy snack option.',
      category: 'Nutrition'
    },
    {
      id: 3,
      title: 'The Power of Seeds: Small but Mighty',
      date: 'March 5, 2024',
      excerpt: 'Learn about the incredible nutritional benefits of seeds and how adding them to your diet can transform your health and wellness journey.',
      content: 'Seeds may be small, but they pack a powerful nutritional punch. From sunflower seeds to pumpkin seeds, each variety offers unique benefits including high protein content, essential fatty acids, and important vitamins and minerals. Incorporating seeds into your daily routine can support everything from heart health to immune function.',
      category: 'Nutrition'
    },
    {
      id: 4,
      title: 'Creating Healthy Snacking Habits',
      date: 'February 28, 2024',
      excerpt: 'Discover tips and strategies for developing healthy snacking habits that support your wellness goals without sacrificing taste or satisfaction.',
      content: 'Healthy snacking doesn\'t have to be boring or unsatisfying. By choosing nutrient-dense options like our premium nuts, dates, and seeds, you can satisfy cravings while nourishing your body. Learn how to create a snacking routine that supports your health goals and keeps you energized throughout the day.',
      category: 'Lifestyle'
    }
  ];

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '70px' }}>
      {/* <Navbar /> */}
      
      <div
        style={{
          maxWidth: breakpoint === 'desktop' ? '1200px' : '100%',
          margin: '0 auto',
          padding: breakpoint === 'mobile' ? '20px' : '40px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: breakpoint === 'mobile' ? '40px' : '60px' }}>
          <h1
            style={{
              fontFamily:"Nunito Sans",
              fontSize: breakpoint === 'mobile' ? '28px' : breakpoint === 'tablet' ? '36px' : '44px',
              marginBottom: '12px',
              color: '#111',
              fontWeight: 700,
            }}
          >
            Our Blog
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: breakpoint === 'mobile' ? '14px' : '16px',
              color: '#666',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Discover health tips, nutrition insights, and wellness stories
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: breakpoint === 'mobile' ? '1fr' : breakpoint === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
            gap: breakpoint === 'mobile' ? '24px' : '32px',
          }}
        >
          {blogPosts.map((post) => (
            <article
              key={post.id}
              style={{
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                padding: breakpoint === 'mobile' ? '20px' : '24px',
                border: '1px solid #eee',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: breakpoint === 'mobile' ? '11px' : '13px',
                  color: '#999',
                  marginBottom: '12px',
                }}
              >
                {post.category} • {post.date}
              </div>
              <h2
                style={{
                  fontFamily:"Nunito Sans",
                  fontSize: breakpoint === 'mobile' ? '18px' : '20px',
                  marginBottom: '12px',
                  color: '#111',
                  lineHeight: '1.2',
                  fontWeight: 600,
                }}
              >
                {post.title}
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: breakpoint === 'mobile' ? '14px' : '15px',
                  lineHeight: '1.6',
                  color: '#333',
                  marginBottom: '16px',
                }}
              >
                {post.excerpt}
              </p>
              <p
                style={{
                  fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
                  fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                  lineHeight: '1.6',
                  color: '#666',
                }}
              >
                {post.content}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

