import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { sendWhatsAppMessage } from '../utils/whatsapp';

const WhatsAppFloat = ({ breakpoint = 'desktop' }) => {
  const handleClick = () => {
    sendWhatsAppMessage('Hi! I would like to know more about your products.');
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: breakpoint === 'mobile' ? '20px' : '30px',
        right: breakpoint === 'mobile' ? '20px' : '30px',
        width: breakpoint === 'mobile' ? '56px' : '64px',
        height: breakpoint === 'mobile' ? '56px' : '64px',
        backgroundColor: '#25D366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
        zIndex: 1000,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 211, 102, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
      }}
    >
      <FaWhatsapp
        style={{
          color: '#fff',
          fontSize: breakpoint === 'mobile' ? '28px' : '32px',
        }}
      />
    </div>
  );
};

export default WhatsAppFloat;

