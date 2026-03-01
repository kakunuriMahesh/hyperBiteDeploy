import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const Contact = () => {
  const [breakpoint, setBreakpoint] = useState('desktop');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '70px' }}>
      {/* <Navbar /> */}
      
      <div
        style={{
          maxWidth: breakpoint === 'desktop' ? '1000px' : '100%',
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
            Contact Us
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
            Get in touch with us. We'd love to hear from you!
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: breakpoint === 'mobile' ? '1fr' : '1fr 1fr',
            gap: breakpoint === 'mobile' ? '40px' : '60px',
          }}
        >
          {/* Contact Information */}
          <div>
            <h2
              style={{
                fontFamily:"Nunito Sans",
                fontSize: breakpoint === 'mobile' ? '20px' : '22px',
                marginBottom: '18px',
                color: '#111',
                fontWeight: 600,
              }}
            >
              Get in Touch
            </h2>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontFamily:"Nunito Sans",
                    fontSize: breakpoint === 'mobile' ? '16px' : '18px',
                    marginBottom: '8px',
                    color: '#111',
                    fontWeight: 600,
                  }}
                >
                  Email
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                    color: '#666',
                  }}
                >
                  info@hyperbite.com
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    fontFamily:"Nunito Sans",
                    fontSize: breakpoint === 'mobile' ? '16px' : '18px',
                    marginBottom: '8px',
                    color: '#111',
                    fontWeight: 600,
                  }}
                >
                  Phone
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                    color: '#666',
                  }}
                >
                  +971 50 123 4567
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Permanent_Marker-Regular', Helvetica",
                    fontSize: breakpoint === 'mobile' ? '18px' : '20px',
                    marginBottom: '8px',
                    color: '#000',
                  }}
                >
                  Address
                </div>
                <div
                  style={{
                    fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
                    fontSize: breakpoint === 'mobile' ? '16px' : '18px',
                    color: '#666',
                    lineHeight: '1.6',
                  }}
                >
                  Dubai, United Arab Emirates<br />
                  Business Bay, Office Tower 1
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                    marginBottom: '8px',
                    color: '#333',
                    fontWeight: 600,
                  }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: breakpoint === 'mobile' ? '12px' : '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                    marginBottom: '8px',
                    color: '#333',
                    fontWeight: 600,
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: breakpoint === 'mobile' ? '12px' : '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
                    fontSize: breakpoint === 'mobile' ? '16px' : '18px',
                    marginBottom: '8px',
                    color: '#333',
                  }}
                >
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: breakpoint === 'mobile' ? '12px' : '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
                    fontSize: breakpoint === 'mobile' ? '16px' : '18px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                    marginBottom: '8px',
                    color: '#333',
                    fontWeight: 600,
                  }}
                >
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: breakpoint === 'mobile' ? '12px' : '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                    marginBottom: '8px',
                    color: '#333',
                    fontWeight: 600,
                  }}
                >
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  style={{
                    width: '100%',
                    padding: breakpoint === 'mobile' ? '12px' : '14px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {submitStatus === 'success' && (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                    fontWeight: 600,
                  }}
                >
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: breakpoint === 'mobile' ? '14px' : '16px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: breakpoint === 'mobile' ? '14px' : '16px',
                  backgroundColor: isSubmitting ? '#ccc' : '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.backgroundColor = '#333';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.backgroundColor = '#000';
                  }
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

