import React from 'react';

const PackDetailsModal = ({ isOpen, onClose, pack }) => {
  if (!isOpen || !pack) return null;

  const details = pack.detailsContent;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#fff',
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}
      >
        {/* Image */}
        <div
          style={{
            height: '140px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <img
            src={pack.image}
            alt={pack.name}
            style={{ maxHeight: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
          {details?.title}
        </h3>

        {/* Subtitle */}
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
          {details?.subtitle}
        </p>

        {/* What's Inside */}
        {details?.whatsInside?.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ fontSize: '13px' }}>What’s Inside:</strong>
            <ul style={{ paddingLeft: '16px', marginTop: '6px' }}>
              {details.whatsInside.map((item, i) => (
                <li key={i} style={{ fontSize: '13px', marginBottom: '4px' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Why You'll Love It */}
        {details?.whyYoullLoveIt?.length > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ fontSize: '13px' }}>Why you’ll love it:</strong>
            <ul style={{ paddingLeft: '16px', marginTop: '6px' }}>
              {details.whyYoullLoveIt.map((item, i) => (
                <li key={i} style={{ fontSize: '13px', marginBottom: '4px' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        {details?.footer && (
          <p style={{ fontSize: '12px', fontWeight: 500 }}>
            {details.footer}
          </p>
        )}

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            marginTop: '12px',
            width: '100%',
            height: '38px',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PackDetailsModal;