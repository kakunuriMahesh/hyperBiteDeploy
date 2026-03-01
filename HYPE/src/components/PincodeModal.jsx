import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { allowedPincodes } from '../config/allowedPincodes';

const PincodeModal = ({ isOpen, onClose, onConfirm }) => {
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!pincode.trim()) {
      setError('Please enter a pincode');
      return;
    }

    if (!allowedPincodes.includes(pincode)) {
      setError('Currently we are not delivering in your location');
      setPincode('');
      return;
    }

    setError('');
    onConfirm(pincode);
    setPincode('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          style={{
            fontFamily: 'Nunito Sans',
            fontSize: '24px',
            marginBottom: '12px',
            color: '#111',
            fontWeight: 700,
          }}
        >
          Delivery Availability
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            color: '#666',
            marginBottom: '24px',
            lineHeight: 1.6,
          }}
        >
          Enter your pincode to check if we deliver to your location.
        </p>

        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              marginBottom: '8px',
              color: '#333',
              fontWeight: 600,
            }}
          >
            Pincode
          </label>
          <input
            type="text"
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter 6-digit pincode"
            style={{
              width: '100%',
              padding: '12px',
              border: error ? '2px solid #ff4444' : '1px solid #ddd',
              borderRadius: '8px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
            autoFocus
          />
          {error && (
            <p
              style={{
                color: '#ff4444',
                fontSize: '12px',
                marginTop: '6px',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {error}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: '#f0f0f0',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e0e0e0';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f0f0f0';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: '12px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#333';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#000';
            }}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default PincodeModal;
