import React, { useState } from "react";
import { useCart } from '../context/CartContext';

const ProductDetailsModal = ({ productDetails, isOpen, onClose, breakpoint }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { pincode, validateAndSetPincode, setPincode } = useCart();
  
  if (!isOpen || !productDetails) return null;

  const images = productDetails.images || [productDetails.image];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: breakpoint === 'mobile' ? '20px' : '40px',
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          width: "100%",
          maxWidth: breakpoint === 'mobile' ? '100%' : breakpoint === 'tablet' ? '600px' : '800px',
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: breakpoint === 'mobile' ? '12px' : '20px',
            right: breakpoint === 'mobile' ? '12px' : '20px',
            background: "transparent",
            border: "none",
            fontSize: breakpoint === 'mobile' ? '24px' : '32px',
            cursor: "pointer",
            color: "#000",
            zIndex: 10001,
            width: breakpoint === 'mobile' ? '32px' : '40px',
            height: breakpoint === 'mobile' ? '32px' : '40px',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => e.target.style.background = "rgba(0,0,0,0.1)"}
          onMouseLeave={(e) => e.target.style.background = "transparent"}
        >
          ×
        </button>

        {/* Content */}
        <div style={{ padding: breakpoint === 'mobile' ? '24px' : '40px' }}>
          {/* Product Image Gallery */}
          <div style={{ marginBottom: breakpoint === 'mobile' ? '24px' : '32px' }}>
            {/* Main Image */}
            <div style={{ textAlign: "center", marginBottom: breakpoint === 'mobile' ? '16px' : '20px' }}>
              <img
                src={images[selectedImageIndex]}
                alt={productDetails.name}
                style={{
                  width: breakpoint === 'mobile' ? '100%' : breakpoint === 'tablet' ? '400px' : '500px',
                  maxWidth: '100%',
                  height: breakpoint === 'mobile' ? 'auto' : '400px',
                  objectFit: "contain",
                  borderRadius: '8px',
                  border: '1px solid #eee',
                }}
              />
            </div>
            
            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: breakpoint === 'mobile' ? '8px' : '12px',
                  flexWrap: 'wrap',
                }}
              >
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    style={{
                      padding: 0,
                      border: selectedImageIndex === index ? '2px solid #000' : '2px solid #ddd',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: 'transparent',
                      overflow: 'hidden',
                      width: breakpoint === 'mobile' ? '60px' : '80px',
                      height: breakpoint === 'mobile' ? '60px' : '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={img}
                      alt={`${productDetails.name} view ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Name */}
          <h2
            style={{
              fontFamily: "'Permanent_Marker-Regular', Helvetica",
              fontSize: breakpoint === 'mobile' ? '32px' : breakpoint === 'tablet' ? '40px' : '48px',
              marginBottom: breakpoint === 'mobile' ? '12px' : '16px',
              textAlign: "center",
              color: "#000",
            }}
          >
            {productDetails.name}
          </h2>

          {/* Description */}
          <p
            style={{
              fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
              fontSize: breakpoint === 'mobile' ? '16px' : '20px',
              lineHeight: "1.5",
              marginBottom: breakpoint === 'mobile' ? '24px' : '32px',
              textAlign: "center",
              color: "#333",
            }}
          >
            {productDetails.description}
          </p>

          {/* Price */}
          <div
            style={{
              textAlign: "center",
              marginBottom: breakpoint === 'mobile' ? '16px' : '24px',
            }}
          >
            <span
              style={{
                fontFamily:"Nunito Sans",
                fontSize: breakpoint === 'mobile' ? '18px' : '22px',
                color: "#111",
                fontWeight: 700,
              }}
            >
              {productDetails.price}
            </span>
          </div>

          {/* Pincode Check */}
          <div style={{ marginBottom: breakpoint === 'mobile' ? '24px' : '32px', textAlign: 'center' }}>
             {pincode ? (
                 <div style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                     <span style={{ color: '#2e7d32', fontWeight: 600, marginRight: '8px' }}>Delivery available at {pincode}</span>
                     <button 
                        onClick={() => setPincode('')}
                        style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: '#666', fontSize: '12px' }}
                     >
                         Change
                     </button>
                 </div>
             ) : (
                 <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                     <input 
                        type="text" 
                        placeholder="Enter Pincode"
                        id="modal-pincode"
                        style={{
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px',
                            width: '150px'
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                validateAndSetPincode(e.target.value);
                            }
                        }}
                     />
                     <button
                        onClick={() => {
                            const val = document.getElementById('modal-pincode').value;
                            validateAndSetPincode(val);
                        }}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#333',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                     >
                         Check
                     </button>
                 </div>
             )}
          </div>

          {/* Ingredients */}
          <div style={{ marginBottom: breakpoint === 'mobile' ? '24px' : '32px' }}>
            <h3
              style={{
                fontFamily:"Nunito Sans",
                fontSize: breakpoint === 'mobile' ? '18px' : '20px',
                marginBottom: breakpoint === 'mobile' ? '10px' : '14px',
                color: "#111",
                fontWeight: 600,
              }}
            >
              Ingredients
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {productDetails.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '13px' : '15px',
                    padding: breakpoint === 'mobile' ? '8px 0' : '10px 0',
                    borderBottom: index < productDetails.ingredients.length - 1 ? "1px solid #eee" : "none",
                    color: "#333",
                  }}
                >
                  • {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div style={{ marginBottom: breakpoint === 'mobile' ? '24px' : '32px' }}>
            <h3
              style={{
                fontFamily:"Nunito Sans",
                fontSize: breakpoint === 'mobile' ? '18px' : '20px',
                marginBottom: breakpoint === 'mobile' ? '10px' : '14px',
                color: "#111",
                fontWeight: 600,
              }}
            >
              Benefits
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {productDetails.benefits.map((benefit, index) => (
                <li
                  key={index}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '13px' : '15px',
                    padding: breakpoint === 'mobile' ? '8px 0' : '10px 0',
                    borderBottom: index < productDetails.benefits.length - 1 ? "1px solid #eee" : "none",
                    color: "#333",
                  }}
                >
                  ✓ {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Nutritional Info */}
          <div>
            <h3
              style={{
                fontFamily: "'Permanent_Marker-Regular', Helvetica",
                fontSize: breakpoint === 'mobile' ? '24px' : '32px',
                marginBottom: breakpoint === 'mobile' ? '12px' : '16px',
                color: "#000",
              }}
            >
              Nutritional Information
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: breakpoint === 'mobile' ? '1fr 1fr' : '1fr 1fr 1fr',
                gap: breakpoint === 'mobile' ? '12px' : '16px',
                fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
                fontSize: breakpoint === 'mobile' ? '14px' : '16px',
              }}
            >
              {Object.entries(productDetails.nutritionalInfo).map(([key, value]) => (
                <div
                  key={key}
                  style={{
                    padding: breakpoint === 'mobile' ? '10px' : '12px',
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "4px", textTransform: "capitalize" }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div style={{ color: "#666" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;

