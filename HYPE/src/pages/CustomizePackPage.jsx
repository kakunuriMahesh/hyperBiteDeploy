import React, { useState, useEffect ,useLayoutEffect, useRef} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaMinus, FaCheckCircle, FaGift, FaStar, FaShippingFast, FaBoxOpen, FaTag, FaTrash } from 'react-icons/fa';
import { GrPowerReset } from "react-icons/gr";
import { productDetails } from '../config/productDetails';
import { packConfigs } from '../config/packConfig';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
// 
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { FaCheckCircle } from 'react-icons/fa';
// import { GrPowerReset } from 'react-icons/gr';

// --- CRITICAL: Register the plugin ---
gsap.registerPlugin(ScrollTrigger);

const CustomizePackPage = () => {
  const navigate = useNavigate();
  const { packId } = useParams();
  const { addPackToCart, startOrUpdateInProgressPack, inProgressPacks } = useCart();

  const [breakpoint, setBreakpoint] = useState('desktop');
  
  const [quantities, setQuantities] = useState(() => {
    const existingPack = inProgressPacks.find(p => p.packId === packId);
    if (existingPack && existingPack.items) {
      return existingPack.items.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {});
    }
    return {};
  });
  const [alertedFilled, setAlertedFilled] = useState(false);

  const pack = packConfigs[packId] || packConfigs.pack500;
  const detailsContent = pack.detailsContent;
  const products = Object.values(productDetails);

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

  const stickyBarRef = useRef(null);
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const element = stickyBarRef.current;
    
    // This creates the "Sticky" effect using GSAP pinning
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: "top 100px",      // Pins when the top of the bar hits the top of the viewport
        endTrigger: "body",    // Keeps pinning until the end of the page
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,     // Keeps the layout from jumping
        zIndex: 1000,
        onEnter: () => {
          gsap.to(element, { 
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)", 
            backgroundColor: "#ffffff",
            duration: 0.3 
          });
        },
        onLeaveBack: () => {
          gsap.to(element, { 
            boxShadow: "none", 
            duration: 0.3 
          });
        }
      });
    }, containerRef);

    return () => ctx.revert(); // Clean up on unmount
  }, []);

  const calculateTotals = () => {
    return products.reduce(
      (acc, product) => {
        const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
        const quantity = quantities[product.id] || 0;
        acc.price += priceValue * quantity;
        acc.items += quantity;
        return acc;
      },
      { price: 0, items: 0 }
    );
  };

  const { price: total, items: totalItems } = calculateTotals();
  const progressPercent = Math.min((total / pack.minPrice) * 100, 100);

  const handleQuantityChange = (productId, change) => {
    const currentQty = quantities[productId] || 0;
    const newQty = Math.max(0, currentQty + change);
    const product = productDetails[productId];
    const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;

    if (change > 0) {
      if (totalItems >= pack.maxItems) {
        toast.warning(`Pack Limit Reached: Maximum ${pack.maxItems} items allowed.`);
        return;
      }
      if (total + priceValue > pack.maxPrice) {
        toast.warning(`Budget Exceeded: Maximum limit is ₹${pack.maxPrice}.`);
        return;
      }
    }

    setQuantities((prev) => ({
      ...prev,
      [productId]: newQty,
    }));
  };

  const handleManualInput = (productId, value) => {
    const numValue = parseInt(value, 10) || 0;
    const currentQty = quantities[productId] || 0;
    
    if (numValue > currentQty) {
        const diff = numValue - currentQty;
        const product = productDetails[productId];
        const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;

        if (totalItems + diff > pack.maxItems) {
            toast.warning(`Pack Limit Reached: Maximum ${pack.maxItems} items allowed.`);
            return;
        }
        if (total + (priceValue * diff) > pack.maxPrice) {
            toast.warning(`Budget Exceeded: Maximum limit is ₹${pack.maxPrice}.`);
            return;
        }
    }

    setQuantities((prev) => ({
      ...prev,
      [productId]: numValue,
    }));
  };

  useEffect(() => {
    const packData = {
      packId: pack.id,
      packName: pack.name,
      packPrice: pack.price,
      packOffPrice: pack.offPrice,
      items: products
        .filter((p) => (quantities[p.id] || 0) > 0)
        .map((p) => ({ id: p.id, quantity: quantities[p.id] || 0 })),
      total,
    };
    startOrUpdateInProgressPack(packData);

    if (total >= pack.minPrice && total <= pack.maxPrice && totalItems <= pack.maxItems && !alertedFilled) {
       if (total === pack.maxPrice || totalItems === pack.maxItems) {
           toast.success("Pack Filled! You can add it to cart.");
           setAlertedFilled(true);
       }
    }

    if (total < pack.minPrice && alertedFilled) {
      setAlertedFilled(false);
    }
  }, [quantities, total, totalItems]);

  const handleOrderNow = () => {
    if (total < pack.minPrice) {
      toast.error(`Please add products worth at least ₹${pack.minPrice}. Current: ₹${total.toFixed(2)}`);
      return;
    }
    if (total > pack.maxPrice || totalItems > pack.maxItems) {
         toast.error(`Please adjust pack to meet limits (Max ₹${pack.maxPrice}, Max ${pack.maxItems} items).`);
         return;
    }

    const packItems = products
      .filter((p) => (quantities[p.id] || 0) > 0)
      .map((p) => ({
        id: p.id,
        quantity: quantities[p.id] || 0,
      }));

    const packData = {
      packId: pack.id,
      packName: pack.name,
      packPrice: pack.price,
      packOffPrice: pack.offPrice,
      items: packItems,
      total,
    };

    addPackToCart(packData);
    toast.success(`${pack.name} added to cart!`);
    navigate('/cart');
  };

  const resetPack = () => {
    setQuantities({});
  };

  return (
    <div
      style={{
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        paddingTop: '70px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: breakpoint === 'mobile' ? '16px' : '30px',
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#007185',
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 0',
            marginBottom: '16px',
          }}
        >
          <FaArrowLeft size={12} />
          Back to Packs
        </button>

        {/* ═══════════════════════════════════════════════════════════════
            PACK DETAILS HERO SECTION
           ═══════════════════════════════════════════════════════════════ */}
        {detailsContent && (
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              border: '1px solid #e3e6e8',
              marginBottom: '24px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: breakpoint === 'mobile' ? 'column' : 'row',
                gap: '0',
              }}
            >
              {/* Left — Pack Image */}
              <div
                style={{
                  flex: breakpoint === 'mobile' ? 'unset' : '0 0 340px',
                  background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: breakpoint === 'mobile' ? '24px' : '32px',
                  borderRight: breakpoint === 'mobile' ? 'none' : '1px solid #e3e6e8',
                  borderBottom: breakpoint === 'mobile' ? '1px solid #e3e6e8' : 'none',
                  minHeight: breakpoint === 'mobile' ? '200px' : '320px',
                }}
              >
                <img
                  src={pack.image || '/assets/CustomizePack.jpeg'}
                  alt={pack.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: breakpoint === 'mobile' ? '180px' : '280px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              </div>

              {/* Right — Pack Details */}
              <div
                style={{
                  flex: 1,
                  padding: breakpoint === 'mobile' ? '20px' : '28px 32px',
                }}
              >
                {/* Title & Badge Row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <h1
                    style={{
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: breakpoint === 'mobile' ? '22px' : '26px',
                      fontWeight: 800,
                      color: '#0f1111',
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {detailsContent.title}
                  </h1>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#232f3e',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      fontFamily: "'Inter', sans-serif",
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    <FaTag size={9} />
                    {pack.badge}
                  </span>
                </div>

                {/* Subtitle */}
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === 'mobile' ? '14px' : '15px',
                    color: '#565959',
                    margin: '0 0 16px 0',
                    lineHeight: 1.6,
                  }}
                >
                  {detailsContent.subtitle}
                </p>

                {/* Pricing Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '10px',
                    marginBottom: '16px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #e3e6e8',
                    flexWrap: 'wrap',
                  }}
                >
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#565959' }}>Price:</span>
                  <span
                    style={{
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: breakpoint === 'mobile' ? '26px' : '30px',
                      fontWeight: 700,
                      color: '#000',
                    }}
                  >
                    ₹{pack.price}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '15px',
                      color: '#999',
                      textDecoration: 'line-through',
                    }}
                  >
                    ₹{pack.offPrice}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#CC0C39',
                      backgroundColor: '#fce4ec',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    Save {pack.discount}
                  </span>
                </div>

                {/* What's Inside */}
                {detailsContent.whatsInside && detailsContent.whatsInside.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h3
                      style={{
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#0f1111',
                        margin: '0 0 10px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <FaBoxOpen size={14} color="#e47911" />
                      What's Inside
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {detailsContent.whatsInside.map((item, index) => (
                        <li
                          key={index}
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '13.5px',
                            color: '#333',
                            padding: '5px 0',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            lineHeight: 1.5,
                          }}
                        >
                          <FaCheckCircle size={12} color="#067D62" style={{ marginTop: '3px', flexShrink: 0 }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Why You'll Love It / Exclusive Perks */}
                {detailsContent.whyYoullLoveIt && detailsContent.whyYoullLoveIt.length > 0 && (
                  <div
                    style={{
                      backgroundColor: '#f0faf4',
                      border: '1px solid #c8e6d0',
                      borderRadius: '8px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#067D62',
                        margin: '0 0 10px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <FaGift size={14} color="#067D62" />
                      {pack.isCustomizable ? 'Exclusive Perks' : "Why You'll Love It"}
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {detailsContent.whyYoullLoveIt.map((item, index) => (
                        <li
                          key={index}
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '13.5px',
                            color: '#1a4731',
                            padding: '4px 0',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            lineHeight: 1.5,
                          }}
                        >
                          <FaStar size={10} color="#e47911" style={{ marginTop: '4px', flexShrink: 0 }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer / Free Delivery */}
                {detailsContent.footer && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      backgroundColor: '#fff8e1',
                      border: '1px solid #ffe082',
                      borderRadius: '6px',
                    }}
                  >
                    <FaShippingFast size={16} color="#e47911" />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#5a4000',
                      }}
                    >
                      {detailsContent.footer}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════
            CUSTOMIZATION SECTION HEADER
           ═══════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #e3e6e8',
            padding: breakpoint === 'mobile' ? '16px' : '24px',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: breakpoint === 'mobile' ? '18px' : '22px',
              fontWeight: 700,
              color: '#0f1111',
              margin: '0 0 4px 0',
            }}
          >
            🛒 Customize Your Pack
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              color: '#565959',
              margin: '0',
            }}
          >
            Select products below to build your perfect snack box — reach at least ₹{pack.minPrice} to proceed
          </p>
        </div>

        {/* ═══════════════════════════════════════
            PROGRESS TRACKER — Sticky on scroll
           ═══════════════════════════════════════ */}
        <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
            {/* ═══════════════════════════════════════
                GSAP STICKY PROGRESS TRACKER
                ═══════════════════════════════════════ */}
            <div
              ref={stickyBarRef}
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: '1px solid #e3e6e8',
                padding: breakpoint === 'mobile' ? '16px' : '20px 24px',
                marginBottom: '24px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Progress Bar Visual */}
              <div
                style={{
                  marginBottom: '14px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  height: '10px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    background: progressPercent >= 100
                      ? 'linear-gradient(90deg, #34a853, #1e8e3e)'
                      : 'linear-gradient(90deg, #ff9800, #f57c00)',
                    width: `${progressPercent}%`,
                    transition: 'width 0.4s ease',
                    borderRadius: '20px',
                  }}
                />
              </div>

              {/* Pricing & Item Count */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 700 }}>
                    MRP ₹{total.toFixed(0)}
                  </span>
                  <span style={{ fontSize: '13px', color: '#565959' }}>
                    / Offer Price ₹{pack.minPrice}
                  </span>
                </div>

                <span style={{ fontSize: '12px', fontWeight: 600, backgroundColor: '#f5f5f5', padding: '2px 8px', borderRadius: '10px' }}>
                  {totalItems}/{pack.maxItems} items
                </span>

                {progressPercent < 100 ? (
                  <span style={{ fontSize: '13px', color: '#e47911', fontWeight: 500 }}>
                    Add ₹{(pack.minPrice - total).toFixed(0)} more
                  </span>
                ) : (
                  <span style={{ fontSize: '13px', color: '#1e8e3e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaCheckCircle size={14} /> Ready!
                  </span>
                )}
              </div>

              {/* Reset Button */}
              <div className='flex items-center gap-2 mt-2'>
                <button onClick={() => resetPack()} className='text-red-500 bg-red-100 px-2 py-1 rounded-lg text-xs flex items-center gap-1'>
                  <GrPowerReset size={12} />
                  Reset Pack
                </button>
              </div>
            </div>
            
              {/* ═══════════════════════════════════════
                  PRODUCTS GRID
                ═══════════════════════════════════════ */}
          </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    breakpoint === 'mobile' ? '1fr' : breakpoint === 'tablet' ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
                  gap: breakpoint === 'mobile' ? '12px' : '16px',
                  marginBottom: '24px',
                }}
              >
                {products.map((product) => {
                  const quantity = quantities[product.id] || 0;
                  const price = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;
                  const itemTotal = price * quantity;
                  const isActive = quantity > 0;

                  return (
                    <div
                      key={product.id}
                      style={{
                        backgroundColor: '#fff',
                        border: isActive ? '2px solid #067D62' : '1px solid #e3e6e8',
                        borderRadius: '12px',
                        padding: breakpoint === 'mobile' ? '12px' : '16px',
                        transition: 'all 0.3s ease',
                      }}
                      className="min-w-[55%] sm:min-w-[40%] md:min-w-[30%] lg:min-w-[20%] cursor-pointer rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      {/* Active Badge */}
                      {isActive && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: '#067D62',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: 700,
                            fontFamily: "'Inter', sans-serif",
                            padding: '2px 8px',
                            borderRadius: '10px',
                          }}
                        >
                          ×{quantity}
                        </div>
                      )}

                      {/* Product Image */}
                      <div
                        style={{
                          marginBottom: '10px',
                          display: 'flex',
                          justifyContent: 'center',
                          height: breakpoint === 'mobile' ? '80px' : '100px',
                        }}
                      >
                        <img
                          src={product.packImg}
                          alt={product.name}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            transition: 'transform 0.3s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                        />
                      </div>

                      {/* Product Name */}
                      <h4
                        style={{
                          fontFamily: "'Nunito Sans', sans-serif",
                          fontSize: breakpoint === 'mobile' ? '13px' : '15px',
                          margin: '0 0 4px 0',
                          color: '#0f1111',
                          fontWeight: 700,
                          lineHeight: 1.3,
                        }}
                      >
                        {product.name}
                      </h4>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: breakpoint === 'mobile' ? '13px' : '14px',
                          color: '#0f1111',
                          fontWeight: 400,
                          margin: '0 0 10px 0',
                        }}
                      >
                        {product.description}
                      </p>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      {/* Price */}
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: breakpoint === 'mobile' ? '13px' : '14px',
                          color: '#0f1111',
                          fontWeight: 600,
                          margin: '0 0 10px 0',
                        }}
                      >
                        ₹{price}
                      </p>

                      {/* Item Total */}
                      {isActive && (
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '12px',
                            color: '#067D62',
                            fontWeight: 600,
                            margin: '0 0 10px 0',
                            // textAlign: 'center',
                          }}
                        >
                          ₹{itemTotal.toFixed(0)} total
                        </p>
                      )}

      </div>
                      <div className='flex justify-between'>
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          style={{
                            padding: '2px 8px',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '12px',
                            fontWeight: 600,
                            backgroundColor: '#fff',
                            color: '#0f1111',
                            border: '1px solid #d5d9d9',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f7fafa';
                            e.target.style.borderColor = '#a6a6a6';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#fff';
                            e.target.style.borderColor = '#d5d9d9';
                          }}
                        >
                          Details
                        </button>
                        {/* Quantity Controls */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            marginBottom: isActive ? '8px' : '0',
                          }}
                        >
                          <button
                            onClick={() => handleQuantityChange(product.id, -1)}
                            style={{
                              width: breakpoint === 'mobile' ? '28px' : '30px',
                              height: breakpoint === 'mobile' ? '28px' : '30px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f0f0f0',
                              border: '1px solid #d5d9d9',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: '#0f1111',
                              transition: 'background 0.2s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e3e6e6'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f0f0f0'; }}
                          >
                            <FaMinus size={10} />
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => handleManualInput(product.id, e.target.value)}
                            style={{
                              width: breakpoint === 'mobile' ? '20px' : '40px',
                              height: breakpoint === 'mobile' ? '20px' : '30px',
                              textAlign: 'center',
                              border: '1px solid #d5d9d9',
                              borderRadius: '6px',
                              fontFamily: "'Inter', sans-serif",
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#0f1111',
                              outline: 'none',
                            }}
                            min="0"
                          />
                          <button
                            onClick={() => handleQuantityChange(product.id, 1)}
                            style={{
                              width: breakpoint === 'mobile' ? '28px' : '30px',
                              height: breakpoint === 'mobile' ? '28px' : '30px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f0f0f0',
                              border: '1px solid #d5d9d9',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              color: '#0f1111',
                              transition: 'background 0.2s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e3e6e6'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f0f0f0'; }}
                          >
                            <FaPlus size={10} />
                          </button>
                      
                        
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>


        {/* ═══════════════════════════════════════
            ACTION BUTTONS
           ═══════════════════════════════════════ */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '16px 24px',
            // backgroundColor: '#fff',
            borderRadius: '12px',
            // border: '1px solid #e3e6e8',
            marginBottom: '40px',
          }}
        >
          <button
            onClick={() => navigate('/products')}
            style={{
              padding: '12px 28px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: '#fff',
              color: '#0f1111',
              border: '1px solid #d5d9d9',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f7fafa';
              e.target.style.borderColor = '#a6a6a6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#fff';
              e.target.style.borderColor = '#d5d9d9';
            }}
          >
            Back to Packs
          </button>
          <button
            onClick={handleOrderNow}
            disabled={total < pack.minPrice}
            style={{
              padding: '12px 36px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: total >= pack.minPrice ? '#067D62' : '#d5d9d9',
              color: total >= pack.minPrice ? '#fff' : '#888',
              border: 'none',
              borderRadius: '8px',
              cursor: total >= pack.minPrice ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              boxShadow: total >= pack.minPrice ? '0 2px 5px rgba(6,125,98,0.3)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (total >= pack.minPrice) {
                e.target.style.backgroundColor = '#055d49';
              }
            }}
            onMouseLeave={(e) => {
              if (total >= pack.minPrice) {
                e.target.style.backgroundColor = '#067D62';
              }
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizePackPage;
