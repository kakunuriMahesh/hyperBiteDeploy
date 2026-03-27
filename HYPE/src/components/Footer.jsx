import React, { useState, useEffect } from "react";
import { FaWhatsapp } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { FaSnapchat } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const [breakpoint, setBreakpoint] = useState('desktop'); // 'mobile', 'tablet', 'desktop'

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

  const currentYear = new Date().getFullYear();

  // Social media links - update these with your actual social media URLs
  const socialLinks = [
    {
      name: 'Whatsapp',
      url: 'http://wa.link/21s7lf',
      icon: (
        <FaWhatsapp size={24} />
      )
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/hyperbite.in/',
      icon: (
        <FaInstagram size={24} />
      )
    },
    {
      name: 'Snapchat',
      url: 'https://snapchat.com/t/47PMrb6m',
      icon: (
        <FaSnapchat size={24} />
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://in.linkedin.com/company/skill-assured',
      icon: (
        <FaLinkedin size={24} />
      )
    }
  ];

  return (
    <footer 
      className="bg-blue-950 w-full border-t border-gray-200"
      style={{
        paddingTop: breakpoint === 'mobile' ? '40px' : breakpoint === 'tablet' ? '50px' : '60px',
        paddingBottom: breakpoint === 'mobile' ? '30px' : breakpoint === 'tablet' ? '40px' : '50px',
        paddingLeft: breakpoint === 'mobile' ? '20px' : breakpoint === 'tablet' ? '50px' : '80px',
        paddingRight: breakpoint === 'mobile' ? '20px' : breakpoint === 'tablet' ? '50px' : '80px',
      }}
    >
      <div 
        style={{
          maxWidth: breakpoint === 'desktop' ? '1200px' : '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: breakpoint === 'mobile' ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: breakpoint === 'mobile' ? 'center' : 'flex-start',
          gap: breakpoint === 'mobile' ? '30px' : breakpoint === 'tablet' ? '40px' : '60px',
        }}
      >
        {/* Company Name */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: breakpoint === 'mobile' ? 'center' : 'flex-start',
            gap: '20px',
          }}
        >
          <div 
            className="[font-family:'Playfair Display',Inter,sans-serif] font-normal text-white tracking-[0] leading-[normal]"
            style={{
              fontSize: breakpoint === 'mobile' ? '24px' : breakpoint === 'tablet' ? '28px' : '34px',
              fontWeight: 700,
            }}
          >
            HyperBite
          </div>
        </div>

        {/* Social Media Links */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: breakpoint === 'mobile' ? 'center' : 'flex-start',
            gap: '20px',
          }}
        >
          <div 
            style={{
              fontSize: breakpoint === 'mobile' ? '14px' : breakpoint === 'tablet' ? '16px' : '18px',
              fontWeight: '600',
              color: '#fff',
              marginBottom: '10px',
            }}
          >
            Follow Us
          </div>
          <div 
            style={{
              display: 'flex',
              gap: breakpoint === 'mobile' ? '20px' : '24px',
              alignItems: 'center',
            }}
          >
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                style={{
                  color: '#000',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: breakpoint === 'mobile' ? '36px' : '40px',
                  height: breakpoint === 'mobile' ? '36px' : '40px',
                  borderRadius: '50%',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#000';
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Terms and Conditions Links */}

        <div className="mt-8 flex flex-wrap justify-center gap-6 border-t border-gray-200 pt-6">
          <Link to="/terms-and-conditions"
            style={{
              fontSize: breakpoint === 'mobile' ? '13px' : breakpoint === 'tablet' ? '14px' : '16px',
              color: '#fff',
              marginRight: '20px',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#fff';
            }}
          >
            Terms and Conditions
          </Link>
          <Link to="/privacy-policy"
            style={{
              fontSize: breakpoint === 'mobile' ? '13px' : breakpoint === 'tablet' ? '14px' : '16px',
              color: '#fff',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
            }}  
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#fff';
            }}
          >
            Privacy Policy
          </Link>
          <Link to="/refund-policy"
            style={{
              fontSize: breakpoint === 'mobile' ? '13px' : breakpoint === 'tablet' ? '14px' : '16px',
              color: '#fff',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#fff';
            }}
          >
            Refund Policy
          </Link>
          <Link to="/shipping-policy"
            style={{
              fontSize: breakpoint === 'mobile' ? '13px' : breakpoint === 'tablet' ? '14px' : '16px',
              color: '#fff',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#fff';
            }}
          >
            Shipping Policy
          </Link>
          <Link to="/return-policy"
            style={{
              fontSize: breakpoint === 'mobile' ? '13px' : breakpoint === 'tablet' ? '14px' : '16px',
              color: '#fff',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#fff';
            }}
          >
            Return Policy
          </Link>
        </div>

      {/* Copyright */}
      <div 
        style={{
          marginTop: breakpoint === 'mobile' ? '30px' : breakpoint === 'tablet' ? '40px' : '50px',
          paddingTop: breakpoint === 'mobile' ? '20px' : breakpoint === 'tablet' ? '25px' : '30px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center',
        }}
      >
        <p 
          className="[font-family:'Inter',sans-serif] font-normal text-white tracking-[0] leading-[normal]"
          style={{
            fontSize: breakpoint === 'mobile' ? '13px' : breakpoint === 'tablet' ? '14px' : '16px',
          }}
        >
          © {currentYear} Hyper Bite. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

