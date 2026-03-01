import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

const About = () => {
  const { t } = useLanguage();
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
            About Us
          </h1>
          <h1>{t('welcome')}</h1>
      <h1>{t('benefits')}</h1>
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
            Your trusted source for premium natural products
          </p>
        </div>

        {/* Company Story */}
        <div style={{ marginBottom: breakpoint === 'mobile' ? '40px' : '60px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: breakpoint === 'mobile' ? '1fr' : '1fr 1fr',
              gap: breakpoint === 'mobile' ? '24px' : '40px',
              alignItems: 'center',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily:"Nunito Sans",
                  fontSize: breakpoint === 'mobile' ? '20px' : '24px',
                  marginBottom: '16px',
                  color: '#111',
                  fontWeight: 600,
                }}
              >
                Our Story
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                  lineHeight: '1.75',
                  color: '#333',
                  marginBottom: '16px',
                }}
              >
                Hyper Bite was founded with a simple mission: to provide the highest quality natural products that nourish your body and support your wellness journey. We believe that nature provides everything we need for optimal health.
              </p>
              <p
                style={{
                  fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
                  fontSize: breakpoint === 'mobile' ? '16px' : '18px',
                  lineHeight: '1.8',
                  color: '#333',
                }}
              >
                Our products are carefully sourced, ensuring freshness and quality in every package. From premium mixed nuts to organic dates and nutritious seeds, we bring you nature's best.
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                height: breakpoint === 'mobile' ? '250px' : '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #eee',
              }}
            >
              <div
                style={{
                  fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
                  fontSize: breakpoint === 'mobile' ? '16px' : '18px',
                  color: '#999',
                  textAlign: 'center',
                }}
              >
                [Company Image Placeholder]
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div style={{ marginBottom: breakpoint === 'mobile' ? '40px' : '60px' }}>
          <h2
            style={{
              fontFamily:"Nunito Sans",
              fontSize: breakpoint === 'mobile' ? '20px' : '22px',
              marginBottom: '18px',
              textAlign: 'center',
              color: '#111',
              fontWeight: 600,
            }}
          >
            Our Mission & Values
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: breakpoint === 'mobile' ? '1fr' : breakpoint === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: breakpoint === 'mobile' ? '24px' : '32px',
            }}
          >
            <div
              style={{
                padding: breakpoint === 'mobile' ? '20px' : '24px',
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                border: '1px solid #eee',
              }}
            >
              <h3
                style={{
                  fontFamily:"Nunito Sans",
                  fontSize: breakpoint === 'mobile' ? '16px' : '18px',
                  marginBottom: '10px',
                  color: '#111',
                  fontWeight: 600,
                }}
              >
                Quality First
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: breakpoint === 'mobile' ? '14px' : '15px',
                  lineHeight: '1.6',
                  color: '#333',
                }}
              >
                We source only the finest ingredients, ensuring every product meets our high standards for freshness and quality.
              </p>
            </div>
            <div
              style={{
                padding: breakpoint === 'mobile' ? '20px' : '24px',
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                border: '1px solid #eee',
              }}
            >
              <h3
                style={{
                  fontFamily:"Nunito Sans",
                  fontSize: breakpoint === 'mobile' ? '16px' : '18px',
                  marginBottom: '10px',
                  color: '#111',
                  fontWeight: 600,
                }}
              >
                Natural & Pure
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: breakpoint === 'mobile' ? '14px' : '15px',
                  lineHeight: '1.6',
                  color: '#333',
                }}
              >
                All our products are 100% natural with no artificial additives, preservatives, or chemicals.
              </p>
            </div>
            <div
              style={{
                padding: breakpoint === 'mobile' ? '20px' : '24px',
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                border: '1px solid #eee',
              }}
            >
              <h3
                style={{
                  fontFamily:"Nunito Sans",
                  fontSize: breakpoint === 'mobile' ? '16px' : '18px',
                  marginBottom: '10px',
                  color: '#111',
                  fontWeight: 600,
                }}
              >
                Customer Focus
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: breakpoint === 'mobile' ? '14px' : '15px',
                  lineHeight: '1.6',
                  color: '#333',
                }}
              >
                Your satisfaction is our priority. We're committed to providing exceptional products and service.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2
            style={{
              fontFamily:"Nunito Sans",
              fontSize: breakpoint === 'mobile' ? '20px' : '22px',
              marginBottom: '18px',
              textAlign: 'center',
              color: '#111',
              fontWeight: 600,
            }}
          >
            Our Team
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: breakpoint === 'mobile' ? '1fr' : breakpoint === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: breakpoint === 'mobile' ? '24px' : '32px',
            }}
          >
            {[
              { name: 'Ahmed Al-Mansoori', role: 'Founder & CEO' },
              { name: 'Fatima Hassan', role: 'Head of Quality' },
              { name: 'Omar Abdullah', role: 'Product Manager' },
              { name: 'Layla Ibrahim', role: 'Customer Relations' },
            ].map((member, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '50%',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #eee',
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: breakpoint === 'mobile' ? '12px' : '14px',
                      color: '#999',
                    }}
                  >
                    [Photo]
                  </div>
                </div>
                <h3
                  style={{
                    fontFamily:"Nunito Sans",
                    fontSize: breakpoint === 'mobile' ? '15px' : '16px',
                    marginBottom: '8px',
                    color: '#111',
                    fontWeight: 600,
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '13px' : '14px',
                    color: '#666',
                  }}
                >
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

