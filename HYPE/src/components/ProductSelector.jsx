// import React, { useState, useEffect } from "react";

// const ProductSelector = ({ selectedProduct, onProductSelect }) => {
//   const [breakpoint, setBreakpoint] = useState('desktop');
//   const [hoveredProduct, setHoveredProduct] = useState(null);

//   useEffect(() => {
//     const updateBreakpoint = () => {
//       const viewportWidth = window.innerWidth;
//       if (viewportWidth < 768) {
//         setBreakpoint('mobile');
//       } else if (viewportWidth < 1024) {
//         setBreakpoint('tablet');
//       } else {
//         setBreakpoint('desktop');
//       }
//     };

//     updateBreakpoint();
//     window.addEventListener('resize', updateBreakpoint);
//     return () => window.removeEventListener('resize', updateBreakpoint);
//   }, []);

//   // Product data - you can update images, names, and descriptions here
//   const products = [
//     {
//       id: 'nuts',
//       name: 'Nuts Mix',
//       image: '/assets/wallnut.webp', // Default product image for nuts
//       description: 'Premium mixed nuts'
//     },
//     {
//       id: 'dates',
//       name: 'Dates',
//       image: '/assets/date.webp',
//       description: 'Fresh organic dates'
//     },
//     {
//       id: 'seeds',
//       name: 'Seeds',
//       image: '/assets/sunflowerseed.webp',
//       description: 'Nutritious seeds collection'
//     }
//   ];

//   return (
//     <div 
//       style={{
//         position: 'fixed',
//         top: breakpoint === 'mobile' ? '120px' : breakpoint === 'tablet' ? '130px' : '140px',
//         right: breakpoint === 'mobile' ? '20px' : breakpoint === 'tablet' ? '30px' : '40px',
//         zIndex: 1000,
//         display: 'flex',
//         gap: breakpoint === 'mobile' ? '12px' : breakpoint === 'tablet' ? '16px' : '20px',
//         flexDirection: breakpoint === 'mobile' ? 'column' : 'row',
//         alignItems: 'center',
//       }}
//     >
//       {products.map((product) => (
//         <div
//           key={product.id}
//           onClick={() => onProductSelect(product.id)}
//           onMouseEnter={() => setHoveredProduct(product.id)}
//           onMouseLeave={() => setHoveredProduct(null)}
//           style={{
//             position: 'relative',
//             cursor: 'pointer',
//             transition: 'all 0.3s ease',
//             transform: selectedProduct === product.id ? 'scale(1.1)' : hoveredProduct === product.id ? 'scale(1.05)' : 'scale(1)',
//             opacity: selectedProduct === product.id ? 1 : hoveredProduct === product.id ? 0.9 : 0.7,
//           }}
//         >
//           {/* Product Image Tab */}
//           <div
//             style={{
//               width: breakpoint === 'mobile' ? '60px' : breakpoint === 'tablet' ? '70px' : '80px',
//               height: breakpoint === 'mobile' ? '60px' : breakpoint === 'tablet' ? '70px' : '80px',
//               borderRadius: '12px',
//               overflow: 'hidden',
//               backgroundColor: '#fff',
//               border: selectedProduct === product.id ? '3px solid #000' : '2px solid #e5e7eb',
//               boxShadow: selectedProduct === product.id 
//                 ? '0 4px 12px rgba(0,0,0,0.15)' 
//                 : hoveredProduct === product.id 
//                 ? '0 2px 8px rgba(0,0,0,0.1)' 
//                 : '0 1px 4px rgba(0,0,0,0.05)',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               padding: '8px',
//               transition: 'all 0.3s ease',
//             }}
//           >
//             <img
//               src={product.image}
//               alt={product.name}
//               style={{
//                 width: '100%',
//                 height: '100%',
//                 objectFit: 'contain',
//               }}
//             />
//           </div>

//           {/* Product Name Tooltip - Shows on hover */}
//           {hoveredProduct === product.id && (
//             <div
//               style={{
//                 position: 'absolute',
//                 top: breakpoint === 'mobile' ? 'auto' : '50%',
//                 bottom: breakpoint === 'mobile' ? '100%' : 'auto',
//                 left: breakpoint === 'mobile' ? '50%' : 'calc(100% + 12px)',
//                 transform: breakpoint === 'mobile' 
//                   ? 'translateX(-50%) translateY(-8px)' 
//                   : 'translateY(-50%)',
//                 backgroundColor: '#000',
//                 color: '#fff',
//                 padding: '8px 16px',
//                 borderRadius: '8px',
//                 fontSize: breakpoint === 'mobile' ? '12px' : '14px',
//                 fontWeight: '600',
//                 whiteSpace: 'nowrap',
//                 zIndex: 1001,
//                 pointerEvents: 'none',
//                 animation: 'fadeIn 0.2s ease',
//                 marginBottom: breakpoint === 'mobile' ? '8px' : '0',
//                 marginLeft: breakpoint === 'mobile' ? '0' : '0',
//               }}
//             >
//               {product.name}
//               {/* Arrow */}
//               <div
//                 style={{
//                   position: 'absolute',
//                   [breakpoint === 'mobile' ? 'top' : 'left']: '100%',
//                   [breakpoint === 'mobile' ? 'left' : 'top']: '50%',
//                   transform: breakpoint === 'mobile' 
//                     ? 'translateX(-50%) translateY(0)' 
//                     : 'translateY(-50%)',
//                   width: '0',
//                   height: '0',
//                   borderStyle: 'solid',
//                   ...(breakpoint === 'mobile' 
//                     ? {
//                         borderTop: '6px solid #000',
//                         borderLeft: '6px solid transparent',
//                         borderRight: '6px solid transparent',
//                         borderBottom: 'none',
//                         marginTop: '2px',
//                       }
//                     : {
//                         borderLeft: '6px solid #000',
//                         borderTop: '6px solid transparent',
//                         borderBottom: '6px solid transparent',
//                         borderRight: 'none',
//                         marginLeft: '2px',
//                       }
//                   ),
//                 }}
//               />
//             </div>
//           )}

//           {/* Active Indicator */}
//           {selectedProduct === product.id && (
//             <div
//               style={{
//                 position: 'absolute',
//                 bottom: '-8px',
//                 left: '50%',
//                 transform: 'translateX(-50%)',
//                 width: '6px',
//                 height: '6px',
//                 borderRadius: '50%',
//                 backgroundColor: '#000',
//                 animation: 'pulse 1.5s ease-in-out infinite',
//               }}
//             />
//           )}
//         </div>
//       ))}

//       <style>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: ${breakpoint === 'mobile' 
//               ? 'translateX(-50%) translateY(-4px)' 
//               : 'translateY(-50%) translateX(-4px)'};
//           }
//           to {
//             opacity: 1;
//             transform: ${breakpoint === 'mobile' 
//               ? 'translateX(-50%) translateY(-8px)' 
//               : 'translateY(-50%) translateX(0)'};
//           }
//         }
//         @keyframes pulse {
//           0%, 100% {
//             opacity: 1;
//             transform: translateX(-50%) scale(1);
//           }
//           50% {
//             opacity: 0.5;
//             transform: translateX(-50%) scale(1.2);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ProductSelector;

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const ProductSelector = ({ selectedProduct, onProductSelect }) => {
  const [breakpoint, setBreakpoint] = useState('desktop');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isManualExpand, setIsManualExpand] = useState(false);
  const [orderedProducts, setOrderedProducts] = useState([
    {
      id: 'nuts',
      name: 'Nuts Mix',
      image: '/assets/rostedNuts.png',
    },
    {
      id: 'dates',
      name: 'Dates',
      image: '/assets/date.webp',
    },
    {
      id: 'seeds',
      name: 'Seeds',
      image: '/assets/sunflowerseed.webp',
    }
  ]);
  const productRefs = useRef([]);

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

  const isMobile = breakpoint === 'mobile';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 120 && !isCollapsed) {
        setIsCollapsed(true);
        setIsManualExpand(false);
      } else if (currentScrollY <= 120 && isCollapsed) {
        setIsCollapsed(false);
        setIsManualExpand(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCollapsed]);

  const isExpanded = !isCollapsed || isManualExpand;

  useEffect(() => {
    if (!isExpanded && selectedProduct) {
      const nonSelectedRefs = productRefs.current.filter(
        (_, index) => orderedProducts[index].id !== selectedProduct
      );
      gsap.to(nonSelectedRefs, {
        opacity: 0,
        scale: 0.8,
        y: -30,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        onComplete: () => {
          nonSelectedRefs.forEach(el => {
            if (el) el.style.visibility = 'hidden';
          });
        }
      });
    } else {
      productRefs.current.forEach(el => {
        if (el) el.style.visibility = 'visible';
      });
      gsap.fromTo(productRefs.current, 
        { opacity: 0, scale: 0.8, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out"
        }
      );
    }
  }, [isExpanded, selectedProduct, orderedProducts]);

  useEffect(() => {
    // Animate reorder with FLIP
    productRefs.current.forEach(el => {
      if (!el || !el._gsapOldRect) return;
      const oldRect = el._gsapOldRect;
      requestAnimationFrame(() => {
        const newRect = el.getBoundingClientRect();
        const dy = oldRect.top - newRect.top;
        gsap.fromTo(el, 
          { y: dy },
          { y: 0, duration: 0.5, ease: "power2.out" }
        );
        el._gsapOldRect = null;
      });
    });
  }, [orderedProducts]);

  const handleSelect = (id) => {
    if (id === selectedProduct) return; // No change

    // Save old rects for FLIP
    productRefs.current.forEach(el => {
      if (el) el._gsapOldRect = el.getBoundingClientRect();
    });

    // Reorder: move selected to front
    setOrderedProducts(prev => [
      prev.find(p => p.id === id),
      ...prev.filter(p => p.id !== id)
    ]);

    onProductSelect(id);
    setHoveredProduct(null);

    if (isManualExpand) {
      setIsManualExpand(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: isMobile ? '100px' : '140px',
        right: isMobile ? '16px' : '42px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '18px' : '26px',
        alignItems: 'flex-end',
      }}
    >
      {orderedProducts.map((product, index) => (
        <div
          key={product.id}
          ref={el => (productRefs.current[index] = el)}
          onClick={() => {
            if (isCollapsed && !isManualExpand && product.id === selectedProduct) {
              setIsManualExpand(true);
            } else if (isCollapsed && isManualExpand && product.id === selectedProduct) {
              setIsManualExpand(false);
            } else {
              handleSelect(product.id);
            }
          }}
          onMouseEnter={() => !isMobile && setHoveredProduct(product.id)}
          onMouseLeave={() => !isMobile && setHoveredProduct(null)}
          style={{
            cursor: 'pointer',
            position: 'relative',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: selectedProduct === product.id 
              ? 'scale(1.18)' 
              : hoveredProduct === product.id 
              ? 'scale(1.1)' 
              : 'scale(1)',
            visibility: 'visible',
            willChange: 'transform, opacity, box-shadow',
          }}
        >
          {/* Enhanced Glassmorphism Circle */}
          <div
            style={{
              width: isMobile ? '42px' : '52px',
              height: isMobile ? '42px' : '52px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: `rgba(255, 255, 255, ${selectedProduct === product.id ? '0.25' : '0.15'})`,
              backdropFilter: 'blur(20px) saturate(200%)',
              WebkitBackdropFilter: 'blur(20px) saturate(200%)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: selectedProduct === product.id 
                ? '0 12px 32px rgba(0, 0, 0, 0.25), inset 0 2px 8px rgba(255, 255, 255, 0.3)' 
                : hoveredProduct === product.id 
                ? '0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 6px rgba(255, 255, 255, 0.2)' 
                : '0 6px 16px rgba(0, 0, 0, 0.15), inset 0 1px 4px rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              transition: 'background 0.4s ease, box-shadow 0.4s ease, border 0.4s ease',
              willChange: 'background, box-shadow, border',
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '50%',
                filter: selectedProduct === product.id ? 'brightness(1.15) contrast(1.1)' : 'brightness(1)',
                transition: 'filter 0.4s ease',
              }}
            />
          </div>

          {/* Tooltip on hover (desktop only) - positioned to the left */}
          {!isMobile && hoveredProduct === product.id && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: 'calc(100% + 18px)',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(20, 20, 20, 0.85)',
                color: '#fff',
                padding: '10px 18px',
                borderRadius: '30px',
                fontSize: '15px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                animation: 'fadeInLeft 0.35s ease forwards',
              }}
            >
              {product.name}
            </div>
          )}

          {/* Active glow ring */}
          {selectedProduct === product.id && (
            <div
              style={{
                position: 'absolute',
                inset: '-6px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.4)',
                pointerEvents: 'none',
                animation: 'gentlePulse 2.5s ease-in-out infinite',
              }}
            />
          )}
        </div>
      ))}

      {/* <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(12px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }

        @keyframes gentlePulse {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.06);
          }
        }
      `}</style> */}
    </div>
  );
};

export default ProductSelector;