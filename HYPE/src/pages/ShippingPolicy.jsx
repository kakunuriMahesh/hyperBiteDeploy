// ShippingPolicy.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const ShippingPolicy = () => {
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
              fontFamily: "Nunito Sans",
              fontSize: breakpoint === 'mobile' ? '28px' : breakpoint === 'tablet' ? '36px' : '44px',
              marginBottom: '12px',
              color: '#111',
              fontWeight: 700,
            }}
          >
            Shipping Policy
          </h1>
        </div>

        {/* Content */}
        <article
          style={{
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            padding: breakpoint === 'mobile' ? '20px' : '24px',
            border: '1px solid #eee',
            transition: 'all 0.3s ease',
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: breakpoint === 'mobile' ? '14px' : '15px',
              lineHeight: '1.6',
              color: '#333',
            }}
          >
            The orders for the user are shipped through registered domestic courier companies and/or speed post 
only. Orders are shipped within 
 from the date of the order and/or payment or as per the delivery 
5 days
date agreed at the time of order confirmation and delivering of the shipment, subject to courier company / 
post office norms. Platform Owner shall not be liable for any delay in delivery by the courier company / 
postal authority. Delivery of all orders will be made to the address provided by the buyer at the time of 
purchase. Delivery of our services will be confirmed on your email ID as specified at the time of 
registration. If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), 
the same is not refundable.
          </p>
        </article>
      </div>
    </div>
  );
};

export default ShippingPolicy;