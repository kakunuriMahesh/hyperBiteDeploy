import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaInstagram, FaLinkedin, FaSnapchat } from 'react-icons/fa';
import { Link } from "react-router-dom";

const Footer = () => {
  const [breakpoint, setBreakpoint] = useState('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const viewportWidth = window.innerWidth;
      if (viewportWidth < 768) setBreakpoint('mobile');
      else if (viewportWidth < 1024) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'Whatsapp', url: 'http://wa.link/21s7lf', icon: <FaWhatsapp size={20} /> },
    { name: 'Instagram', url: 'https://www.instagram.com/hyperbite.in/', icon: <FaInstagram size={20} /> },
    { name: 'Snapchat', url: 'https://snapchat.com/t/47PMrb6m', icon: <FaSnapchat size={20} /> },
    { name: 'LinkedIn', url: 'https://in.linkedin.com/company/skill-assured', icon: <FaLinkedin size={20} /> },
  ];

  const isMobile = breakpoint === 'mobile';
  const pad = isMobile ? '30px 20px' : '50px 80px';

  return (
    <footer style={{
      background: '#1c1917',
      padding: pad,
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'center' : 'flex-start',
        gap: isMobile ? '28px' : '60px',
      }}>
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          gap: '16px',
        }}>
          <span style={{
            fontFamily: "'Playfair Display', 'Inter', sans-serif",
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: 700,
            color: '#faf8f5',
            letterSpacing: '-0.02em',
          }}>
            HyperBite
          </span>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px', color: '#a8a29e',
            maxWidth: '260px', lineHeight: 1.6,
            textAlign: isMobile ? 'center' : 'left',
          }}>
            Premium nuts, dates & seeds — nature's finest, delivered to your door.
          </span>
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: isMobile ? 'center' : 'flex-start',
          gap: '16px',
        }}>
          <span style={{
            fontSize: isMobile ? '14px' : '16px',
            fontWeight: 600, color: '#faf8f5',
          }}>
            Follow Us
          </span>
          <div style={{
            display: 'flex', gap: isMobile ? '16px' : '20px',
            alignItems: 'center',
          }}>
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                style={{
                  color: '#1c1917',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: isMobile ? '36px' : '40px',
                  height: isMobile ? '36px' : '40px',
                  borderRadius: '50%',
                  background: '#faf8f5',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f59e0b';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#faf8f5';
                  e.currentTarget.style.color = '#1c1917';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px',
        marginTop: isMobile ? '24px' : '32px',
        paddingTop: isMobile ? '20px' : '24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {[
          { to: '/terms-and-conditions', label: 'Terms & Conditions' },
          { to: '/privacy-policy', label: 'Privacy Policy' },
          { to: '/refund-policy', label: 'Refund Policy' },
          { to: '/shipping-policy', label: 'Shipping Policy' },
          { to: '/return-policy', label: 'Return Policy' },
        ].map((link, i) => (
          <Link
            key={i}
            to={link.to}
            style={{
              fontSize: isMobile ? '12px' : '13px',
              color: '#a8a29e',
              textDecoration: 'none',
              fontFamily: "'Inter', sans-serif",
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f59e0b'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#a8a29e'; }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div style={{
        marginTop: isMobile ? '24px' : '36px',
        paddingTop: isMobile ? '16px' : '20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: isMobile ? '12px' : '13px',
          color: '#78716c',
          margin: 0,
        }}>
          &copy; {currentYear} HyperBite. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
