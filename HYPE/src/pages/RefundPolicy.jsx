// RefundPolicy.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const RefundPolicy = () => {
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
            Refund and Cancellation Policy
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
            This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service 
that you have purchased through the Platform. Under this policy:

Cancellations will only be considered if the request is made 
 of placing the order. However, 
7 days
cancellation requests may not be entertained if the orders have been communicated to such sellers / 
merchant(s) listed on the Platform and they have initiated the process of shipping them, or the 
product is out for delivery. In such an event, you may choose to reject the product at the doorstep.
SaptaPoshaka Natural Foods Private Limited does not accept cancellation requests for 
perishable items like flowers, eatables, etc. However, the refund / replacement can be made if the 
user establishes that the quality of the product delivered is not good.
In case of receipt of damaged or defective items, please report to our customer service team. The 
request would be entertained once the seller/ merchant listed on the Platform, has checked and 
determined the same at its own end. This should be reported within 
 of receipt of products. 
7 days
In case you feel that the product received is not as shown on the site or as per your expectations, 
you must bring it to the notice of our customer service within 
 of receiving the product. The 
7 days
customer service team after looking into your complaint will take an appropriate decision.
In case of complaints regarding the products that come with a warranty from the manufacturers, 
please refer the issue to them.
In case of any refunds approved by 
, it will take 
SaptaPoshaka Natural Foods Private Limited
7 
 for the refund to be processed to you.
days
          </p>
        </article>
      </div>
    </div>
  );
};

export default RefundPolicy;