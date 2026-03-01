import React from 'react';
import { FaTag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

const PackCard = ({ pack, breakpoint, onClickCustomize, onClickAdd, isCustomized = false }) => {
  const { 
    packItems, 
    addPackToCart, 
    updatePackQuantity, 
    pincode, 
    setPincode, 
    validateAndSetPincode 
  } = useCart();

  const { t } = useLanguage();

  const existingPack = packItems.find((p) => p.packId === pack.id);
  const qty = existingPack ? existingPack.quantity : 0;

  // We'll use a ref or local state if needed, but here we can use document.getElementById safely
  const handleCheckPincode = () => {
    const input = document.getElementById(`pincode-${pack.id}`);
    if (input) {
      validateAndSetPincode(input.value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCheckPincode();
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        padding: breakpoint === 'mobile' ? '20px' : '24px',
        border: '2px solid #eee',
        cursor: pack.isCustomizable ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        if (pack.isCustomizable) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
          e.currentTarget.style.borderColor = '#000';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#eee';
      }}
    >
      {/* Badge */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: '#000',
          color: '#fff',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <FaTag size={10} />
        {pack.badge}
      </div>

      {/* Image/Icon */}
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'center',
          height: '120px',
          // backgroundColor: '#fff',
          borderRadius: '8px',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {pack.image ? (
          <img
            src='/assets/CustomizePack.jpeg'
            alt={pack.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        ) : (
          <div style={{ fontSize: '48px', color: '#ddd' }}>📦</div>
        )}
      </div>

      <h3
        style={{
          fontFamily: 'Nunito Sans',
          fontSize: breakpoint === 'mobile' ? '18px' : '20px',
          marginBottom: '8px',
          color: '#111',
          fontWeight: 600,
        }}
      >
        {pack.name}
      </h3>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '14px',
          color: '#666',
          marginBottom: '16px',
          lineHeight: 1.5,
          minHeight: '40px',
        }}
      >
        {pack.description}
      </p>

      {/* Pricing */}
      <div
        style={{
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontFamily: 'Nunito Sans',
            fontSize: breakpoint === 'mobile' ? '20px' : '24px',
            color: '#111',
            fontWeight: 700,
          }}
        >
          ₹{pack.price}
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            color: '#999',
            textDecoration: 'line-through',
          }}
        >
          ₹{pack.offPrice}
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '12px',
            backgroundColor: '#ff4444',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 600,
          }}
        >
          {pack.discount}
        </span>
      </div>

      {pack.isCustomizable && isCustomized && (
        <div
          style={{
            marginBottom: '12px',
            padding: '8px 12px',
            backgroundColor: '#e8f5e9',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#2e7d32',
            fontWeight: 500,
          }}
        >
          ✓ Pack started
        </div>
      )}

      {/* Pincode Section –– now using hooks properly */}
      <div style={{ marginBottom: '16px' }}>
        {pincode ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              marginBottom: '8px',
            }}
          >
            <span style={{ color: '#2e7d32', fontWeight: 600 }}>
              {t('delivering_to')} {pincode}
            </span>
            <button
              onClick={() => setPincode('')}
              style={{
                background: 'none',
                border: 'none',
                textDecoration: 'underline',
                cursor: 'pointer',
                color: '#666',
              }}
            >
              {t('change')}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              placeholder={t('enter_pincode')}
              id={`pincode-${pack.id}`}
              style={{
                flex: 1,
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
              }}
              onKeyDown={handleKeyDown}
              maxLength={6}
            />
            <button
              onClick={handleCheckPincode}
              style={{
                padding: '8px 12px',
                backgroundColor: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {t('check')}
            </button>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          disabled={!pincode}
          onClick={() => {
            if (pack.isCustomizable) {
              onClickCustomize(pack);
              return;
            }
            onClickAdd(pack);
          }}
          style={{
            width: '100%',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pincode ? '#000' : '#ccc',
            color: '#fff',
            borderRadius: '8px',
            border: 'none',
            cursor: pincode ? 'pointer' : 'not-allowed',
            fontSize: '16px',
            fontWeight: 600,
            transition: 'background-color 0.3s',
          }}
        >
          {pack.isCustomizable ? 'Customize Pack' : 'Add Pack'}
        </button>
      </div>
    </div>
  );
};

export default PackCard;