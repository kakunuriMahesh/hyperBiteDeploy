// ReturnPolicy.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const ReturnPolicy = () => {
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
            Return Policy
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
            We offer refund / exchange within first 
 from the date of your purchase. If 
 have passed 
5 days
5 days
since your purchase, you will not be offered a return, exchange or refund of any kind. In order to become 
eligible for a return or an exchange, (i) the purchased item should be unused and in the same condition as 
you received it, (ii) the item must have original packaging, (iii) if the item that you purchased on a sale, 
then the item may not be eligible for a return / exchange. Further, only such items are replaced by us 
(based on an exchange request), if such items are found defective or damaged.

You agree that there may be a certain category of products / items that are exempted from returns or 
refunds. Such categories of the products would be identified to you at the item of purchase. For exchange 
/ return accepted request(s) (as applicable), once your returned product / item is received and inspected 
by us, we will send you an email to notify you about receipt of the returned / exchanged product. Further. 
If the same has been approved after the quality check at our end, your request (i.e. return / exchange) will 
be processed in accordance with our policies.
          </p>
        </article>
      </div>
    </div>
  );
};

export default ReturnPolicy;