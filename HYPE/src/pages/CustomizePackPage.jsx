import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaMinus } from 'react-icons/fa';
import { productDetails } from '../config/productDetails';
import { packConfigs } from '../config/packConfig';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const CustomizePackPage = () => {
  const navigate = useNavigate();
  const { packId } = useParams();
  const { addPackToCart, startOrUpdateInProgressPack, inProgressPacks } = useCart();

  const [breakpoint, setBreakpoint] = useState('desktop');
  
  // Initialize quantities from in-progress pack if it exists
  const [quantities, setQuantities] = useState(() => {
    const existingPack = inProgressPacks.find(p => p.packId === packId);
    if (existingPack && existingPack.items) {
      return existingPack.items.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {});
    }
    return {};
  }); // No need for selectedItems anymore
  const [alertedFilled, setAlertedFilled] = useState(false);

  const pack = packConfigs[packId] || packConfigs.pack500;
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

  // Calculate total price and items
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
  // alert(total,'check')
  const progressPercent = Math.min((total / pack.minPrice) * 100, 100);

  const handleQuantityChange = (productId, change) => {
    const currentQty = quantities[productId] || 0;
    const newQty = Math.max(0, currentQty + change);
    const product = productDetails[productId];
    const priceValue = parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0;

    // Validation when adding
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
        // Checking difference
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

  // Persist in-progress pack whenever quantities change
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

    // Alert when pack is full or within valid range
    // Logic: If user hit the exact max or is within valid range to buy
    if (total >= pack.minPrice && total <= pack.maxPrice && totalItems <= pack.maxItems && !alertedFilled) {
       // Only show if we "just" filled it.
       // For now, let's keep it simple: if it's valid, user sees the button.
       // The user requested: "disable the items and show the add to cart button else show a popup"
       // We handle "disable" via validation in change handlers.
       if (total === pack.maxPrice || totalItems === pack.maxItems) {
           toast.success("Pack Filled! You can add it to cart.");
           setAlertedFilled(true);
       }
    }

    // Reset alert if they go below minimum
    if (total < pack.minPrice && alertedFilled) {
      setAlertedFilled(false);
    }
  }, [quantities, total, totalItems]);

  const handleOrderNow = () => {
    if (total < pack.minPrice) {
      toast.error(`Please add products worth at least ₹${pack.minPrice}. Current: ₹${total.toFixed(2)}`);
      return;
    }
    // Double check constraints (though UI shouldn't allow it)
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

  return (
    <div
      style={{
        backgroundColor: '#fff',
        minHeight: '100vh',
        paddingTop: '70px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: breakpoint === 'mobile' ? '20px' : '30px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '30px',
          }}
        >
          <button
            onClick={() => navigate('/products')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#111',
            }}
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1
              style={{
                fontFamily: 'Nunito Sans',
                fontSize: breakpoint === 'mobile' ? '22px' : '28px',
                margin: 0,
                color: '#111',
                fontWeight: 700,
              }}
            >
              {pack.name}
            </h1>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                color: '#666',
                margin: '4px 0 0 0',
              }}
            >
              Select products to reach ₹{pack.minPrice}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            marginBottom: '30px',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '8px',
              backgroundColor: progressPercent >= 100 ? '#4caf50' : '#ff9800',
              width: `${progressPercent}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '1px solid #eee',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                color: '#666',
                margin: 0,
              }}
            >
              Total Selected
            </p>
            <p
              style={{
                fontFamily: 'Nunito Sans',
                fontSize: '28px',
                color: progressPercent >= 100 ? '#4caf50' : '#111',
                margin: '4px 0 0 0',
                fontWeight: 700,
              }}
            >
              ₹{total.toFixed(2)}
            </p>
            <p style={{ fontSize: '12px', color: '#666' }}>
               ({totalItems} / {pack.maxItems} Items)
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                color: '#666',
                margin: 0,
              }}
            >
              Requirements
            </p>
            <p
              style={{
                fontFamily: 'Nunito Sans',
                fontSize: '28px',
                color: '#111',
                margin: '4px 0 0 0',
                fontWeight: 700,
              }}
            >
              Min ₹{pack.minPrice}
            </p>
             <p style={{ fontSize: '12px', color: '#666' }}>
               (Max ₹{pack.maxPrice})
            </p>
          </div>
        </div>

        {progressPercent < 100 && (
          <div
            style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '24px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              color: '#856404',
            }}
          >
            ⚠️ Add ₹{(pack.minPrice - total).toFixed(2)} and {pack.allowPacksCount - Object.values(quantities).reduce((sum, q) => sum + q, 0)} more to complete this pack
          </div>
        )}

        {/* Products Grid - Quantity controls always visible */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              breakpoint === 'mobile' ? '1fr' : breakpoint === 'tablet' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            gap: '20px',
            marginBottom: '30px',
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
                  backgroundColor: isActive ? '#f8f8f8' : '#fff',
                  border: isActive ? '2px solid #000' : '1px solid #eee',
                  borderRadius: '12px',
                  padding: '16px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Product Image */}
                <div
                  style={{
                    marginBottom: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                    height: '100px',
                  }}
                >
                  <img
                    src={product.packImg}
                    alt={product.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </div>

                {/* Product Name */}
                <h4
                  style={{
                    fontFamily: 'Nunito Sans',
                    fontSize: '16px',
                    margin: '0 0 8px 0',
                    color: '#111',
                    fontWeight: 600,
                  }}
                >
                  {product.name}
                </h4>

                {/* Price */}
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '14px',
                    color: '#666',
                    margin: '0 0 12px 0',
                  }}
                >
                  ₹{price} per unit
                </p>

                {/* Quantity Controls - Always visible */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <button
                    onClick={() => handleQuantityChange(product.id, -1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: '#000',
                    }}
                  >
                    <FaMinus size={12} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleManualInput(product.id, e.target.value)}
                    style={{
                      width: '50px',
                      height: '28px',
                      textAlign: 'center',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '14px',
                    }}
                    min="0"
                  />
                  <button
                    onClick={() => handleQuantityChange(product.id, 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: '#000',
                    }}
                  >
                    <FaPlus size={12} />
                  </button>
                </div>

                {/* Item Total */}
                <p
                  style={{
                    fontFamily: 'Nunito Sans',
                    fontSize: '14px',
                    color: '#000',
                    fontWeight: 600,
                    margin: 0,
                    minHeight: '20px',
                  }}
                >
                  {quantity > 0 ? `₹${itemTotal.toFixed(2)} total` : ' '}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            padding: '20px 0',
          }}
        >
          <button
            onClick={() => navigate('/products')}
            style={{
              padding: '12px 24px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: '#fff',
              color: '#000',
              border: '1px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f5f5f5';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#fff';
            }}
          >
            Back
          </button>
          <button
            onClick={handleOrderNow}
            disabled={total < pack.minPrice}
            style={{
              padding: '12px 24px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: total >= pack.minPrice ? '#000' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: total >= pack.minPrice ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (total >= pack.minPrice) {
                e.target.style.backgroundColor = '#333';
              }
            }}
            onMouseLeave={(e) => {
              if (total >= pack.minPrice) {
                e.target.style.backgroundColor = '#000';
              }
            }}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizePackPage;

