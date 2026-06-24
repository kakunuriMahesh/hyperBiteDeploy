import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../store/hooks/useCart";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash, FaPlus, FaMinus, FaEdit, FaChevronDown, FaChevronUp, FaArrowLeft, FaGift, FaTag } from "react-icons/fa";
import { toast } from "react-toastify";
import { productDetails } from "../config/productDetails";
import {
  selectIdentifier,
  selectUnclaimedRewards,
  claimReward,
} from "../store/slices/rewardsSlice";

const PackItemCard = ({
  pack,
  index,
  breakpoint,
  removePackFromCart,
  updatePackQuantity,
  navigate,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { startOrUpdateInProgressPack } = useCart();

  const handleEdit = () => {
    startOrUpdateInProgressPack({
      packId: pack.packId,
      packName: pack.packName,
      packPrice: pack.packPrice,
      packOffPrice: pack.packOffPrice,
      items: pack.items,
      total: pack.total || pack.packPrice,
    });
    removePackFromCart(pack.instanceId);
    navigate(`/customize-pack/${pack.packId}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: breakpoint === "mobile" ? "12px" : "16px",
        padding: breakpoint === "mobile" ? "12px" : "16px",
        marginBottom: breakpoint === "mobile" ? "8px" : "12px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        border: "1px solid #e5e7eb",
        transition: "all 0.2s ease",
      }}
    >
      <div
        style={{
          width: breakpoint === "mobile" ? "80px" : "100px",
          height: breakpoint === "mobile" ? "80px" : "100px",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <img
          src="/assets/CustomizePack.jpeg"
          alt="Customize Pack"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
        <div>
          <h3
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: breakpoint === "mobile" ? "14px" : "16px",
              marginBottom: "2px",
              color: "#1a1a1a",
              fontWeight: 700,
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {pack.packName}
          </h3>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "11px",
              color: "#9ca3af",
              marginBottom: "4px",
            }}
          >
            {pack.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0} items in pack
          </p>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "6px" }}>
            <span
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: breakpoint === "mobile" ? "16px" : "18px",
                color: "#1a1a1a",
                fontWeight: 700,
              }}
            >
              ₹{pack.packPrice.toFixed(0)}
            </span>
            {pack.packOffPrice > 0 && pack.packOffPrice !== pack.packPrice && (
              <>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    color: "#9ca3af",
                    textDecoration: "line-through",
                  }}
                >
                  ₹{pack.packOffPrice.toFixed(0)}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "11px",
                    color: "#16a34a",
                    fontWeight: 600,
                  }}
                >
                  {Math.round(((pack.packOffPrice - pack.packPrice) / pack.packOffPrice) * 100)}% off
                </span>
              </>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {pack.packPrice !== 250 && (
            <>
              <button
                onClick={() => setShowDetails(!showDetails)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontFamily: "'Inter', sans-serif",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                {showDetails ? "Hide" : "View"} {showDetails ? <FaChevronUp size={9} /> : <FaChevronDown size={9} />}
              </button>
             <div>
        </div>
              {pack.packName !== "The Discovery Pack (10 Pcs)" && (
                <>
                  <span style={{ color: "#d1d5db", fontSize: "10px" }}>|</span>

                  <button
                    onClick={handleEdit}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#3b82f6",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontFamily: "'Inter', sans-serif",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <FaEdit size={10} /> Edit
                  </button>
                </>
              )}
              <span style={{ color: "#d1d5db", fontSize: "10px" }}>|</span>
            </>
          )}
          <button
            onClick={() => removePackFromCart(pack.instanceId || pack.packId)}
            style={{
              background: "none",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              fontSize: "11px",
              fontFamily: "'Inter', sans-serif",
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "3px",
            }}
          >
            <FaTrash size={10} /> Delete
          </button>
        </div>

        {showDetails && (
          <div
            style={{
              marginTop: "8px",
              padding: "8px",
              background: "#f9fafb",
              borderRadius: "6px",
              border: "1px solid #f0f0f0",
              maxHeight: "120px",
              overflowY: "auto",
            }}
          >
            {pack.items?.map((item, i) => {
              const pDetails = productDetails[item.id];
              return (
                <div
                  key={i}
                  style={{
                    fontSize: "11px",
                    marginBottom: "3px",
                    color: "#4b5563",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{pDetails?.name || item.id}</span>
                  <span style={{ color: "#9ca3af" }}>×{item.quantity}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => updatePackQuantity(pack.instanceId || pack.packId, pack.quantity - 1)}
            disabled={pack.quantity <= 1}
            style={{
              width: breakpoint === "mobile" ? "28px" : "32px",
              height: breakpoint === "mobile" ? "28px" : "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f9fafb",
              border: "none",
              borderRight: "1px solid #e5e7eb",
              cursor: pack.quantity > 1 ? "pointer" : "not-allowed",
              color: pack.quantity > 1 ? "#1a1a1a" : "#d1d5db",
            }}
          >
            <FaMinus size={10} />
          </button>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              minWidth: breakpoint === "mobile" ? "28px" : "36px",
              textAlign: "center",
              color: "#1a1a1a",
              background: "#fff",
              lineHeight: breakpoint === "mobile" ? "28px" : "32px",
            }}
          >
            {pack.quantity}
          </span>
          <button
            onClick={() => updatePackQuantity(pack.instanceId || pack.packId, pack.quantity + 1)}
            style={{
              width: breakpoint === "mobile" ? "28px" : "32px",
              height: breakpoint === "mobile" ? "28px" : "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f9fafb",
              border: "none",
              borderLeft: "1px solid #e5e7eb",
              cursor: "pointer",
              color: "#1a1a1a",
            }}
          >
            <FaPlus size={10} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    packItems,
    inProgressPacks,
    finalizeInProgressPack,
    removeInProgressPack,
    removeFromCart,
    updateQuantity,
    removePackFromCart,
    updatePackQuantity,
    getCartTotal,
  } = useCart();
  const [breakpoint, setBreakpoint] = useState("desktop");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({ points: 0, email: '' });

  const rewardsIdentifier = useSelector(selectIdentifier);
  const unclaimedRewards = useSelector(selectUnclaimedRewards);
  const dispatchRewards = useDispatch();
  const [applyMode, setApplyMode] = useState('reward');
  const [appliedReward, setAppliedReward] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const checkoutSummary = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
      + packItems.reduce((sum, pack) => sum + pack.quantity, 0);
    const totalMRP = cartItems.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price;
      return sum + (price * item.quantity);
    }, 0) + packItems.reduce((sum, pack) => {
      const mrp = (pack.packOffPrice && pack.packOffPrice > 0 && pack.packOffPrice !== pack.packPrice)
        ? pack.packOffPrice : pack.packPrice;
      return sum + (mrp * pack.quantity);
    }, 0);
    const sellingTotal = getCartTotal();
    const totalDiscount = totalMRP - sellingTotal;
    const deliveryCharge = 0;
    let extraDiscount = 0;
    let freeShippingApplied = false;
    if (appliedReward) {
      if (appliedReward.type === 'discount_percent') {
        extraDiscount = sellingTotal * (appliedReward.value / 100);
      }
      if (appliedReward.type === 'free_shipping') {
        freeShippingApplied = true;
      }
    }
    if (appliedCoupon) {
      if (appliedCoupon.discount > 0) {
        extraDiscount = sellingTotal * (appliedCoupon.discount / 100);
      }
      if (appliedCoupon.freeShipping) {
        freeShippingApplied = true;
      }
    }
    const finalTotal = Math.max(0, sellingTotal - extraDiscount);
    return { totalItems, totalMRP, sellingTotal, totalDiscount, deliveryCharge, extraDiscount, freeShippingApplied, finalTotal };
  }, [cartItems, packItems, getCartTotal, appliedReward, appliedCoupon]);

  const handleApplyReward = (reward) => {
    if (appliedReward && appliedReward.id === reward.id) {
      setAppliedReward(null);
      return;
    }
    setAppliedReward(reward);
    setAppliedCoupon(null);
    setCouponCode('');
    dispatchRewards(claimReward(reward.id));
    toast.success(`${reward.label} applied!`);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const code = couponCode.trim().toUpperCase();
    if (code === 'HYPER10') {
      setAppliedCoupon({ code: 'HYPER10', discount: 10 });
      setAppliedReward(null);
      setCouponError('');
      toast.success('Coupon HYPER10 applied! 10% off');
    } else if (code === 'FREESHIP') {
      setAppliedCoupon({ code: 'FREESHIP', discount: 0, freeShipping: true });
      setAppliedReward(null);
      setCouponError('');
      toast.success('Free shipping coupon applied!');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleRemoveApplied = () => {
    setAppliedReward(null);
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  useEffect(() => {
    const updateBreakpoint = () => {
      const viewportWidth = window.innerWidth;
      if (viewportWidth < 768) {
        setBreakpoint("mobile");
      } else if (viewportWidth < 1024) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);



  if (cartItems.length === 0 && packItems.length === 0 && inProgressPacks.length === 0) {
    return (
      <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh", paddingTop: "80px" }}>
        {/* Success Modal for empty cart after payment */}
        {showSuccessModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              backdropFilter: "blur(4px)",
            }}
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/");
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                padding: "40px 32px",
                maxWidth: "420px",
                width: "90%",
                textAlign: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                animation: "modalSlideIn 0.3s ease",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2
                style={{
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "26px",
                  fontWeight: 800,
                  color: "#1f2937",
                  marginBottom: "8px",
                }}
              >
                Payment Successful!
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "24px",
                }}
              >
                Thank you for your order
              </p>
              <div
                style={{
                  background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "20px",
                  border: "1px solid #fde68a",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    color: "#92400e",
                    marginBottom: "8px",
                    fontWeight: 500,
                  }}
                >
                  🎉 You earned
                </p>
                <p
                  style={{
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontSize: "40px",
                    fontWeight: 800,
                    color: "#d97706",
                    margin: "0 0 4px 0",
                    lineHeight: 1,
                  }}
                >
                  {successData.points}
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    color: "#92400e",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  HyperBite Points
                </p>
              </div>
              {successData.email && (
                <div
                  style={{
                    background: "#f3f4f6",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginBottom: "24px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "12px",
                      color: "#6b7280",
                      margin: "0 0 4px 0",
                    }}
                  >
                    Track your points with
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      color: "#1f2937",
                      fontWeight: 600,
                      margin: 0,
                      wordBreak: "break-all",
                    }}
                  >
                    {successData.email}
                  </p>
                </div>
              )}
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/");
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(30,58,138,0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(30,58,138,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(30,58,138,0.2)";
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: breakpoint === "mobile" ? "40px 20px" : "80px 40px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "calc(100vh - 80px)",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              boxShadow: "0 4px 12px rgba(59,130,246,0.1)",
            }}
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5">
              <path d="M6 3h12M6 7h12M6 11h6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="17" cy="17" r="4" stroke="#3b82f6"/>
              <circle cx="7" cy="17" r="4" stroke="#3b82f6"/>
              <path d="M11 17h2" stroke="#3b82f6" strokeLinecap="round"/>
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: breakpoint === "mobile" ? "28px" : "36px",
              marginBottom: "12px",
              color: "#1f2937",
              fontWeight: 800,
            }}
          >
            Your Cart Awaits Adventure
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: breakpoint === "mobile" ? "16px" : "18px",
              marginBottom: "32px",
              color: "#6b7280",
              maxWidth: "400px",
            }}
          >
            Discover our premium selection of nuts, dates, and seeds. Start filling your cart with nature's finest!
          </p>
          <button
            onClick={() => navigate("/products")}
            style={{
              padding: breakpoint === "mobile" ? "12px 24px" : "14px 28px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "16px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "#fff",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(59,130,246,0.2)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 16px rgba(59,130,246,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(59,130,246,0.2)";
            }}
          >
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f9fafb", minHeight: "100vh", paddingTop: "80px" }}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: breakpoint === "mobile" ? "24px 16px" : "48px 32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: breakpoint === "mobile" ? "10px" : "16px", marginBottom: breakpoint === "mobile" ? "16px" : "24px" }}>
          <button
            onClick={() => navigate("/products")}
            style={{
              width: breakpoint === "mobile" ? "32px" : "40px",
              height: breakpoint === "mobile" ? "32px" : "40px",
              borderRadius: "50%",
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              flexShrink: 0,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
            }}
          >
            <FaArrowLeft size={breakpoint === "mobile" ? 13 : 16} color="#1f2937" />
          </button>
          <div>
            <h1
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: breakpoint === "mobile" ? "20px" : "28px",
                color: "#1f2937",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Shopping Cart
            </h1>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: breakpoint === "mobile" ? "12px" : "13px",
              color: "#9ca3af",
              margin: "2px 0 0 0",
            }}>
              {cartItems.reduce((sum, i) => sum + i.quantity, 0) + packItems.reduce((sum, p) => sum + p.quantity, 0)} items in your cart
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          {cartItems.map((item, index) => (
            <div
              key={`${item.id}-${item.variation || "default"}-${index}`}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: breakpoint === "mobile" ? "12px" : "16px",
                padding: breakpoint === "mobile" ? "12px" : "16px",
                marginBottom: breakpoint === "mobile" ? "8px" : "12px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                border: "1px solid #e5e7eb",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  width: breakpoint === "mobile" ? "80px" : "100px",
                  height: breakpoint === "mobile" ? "80px" : "100px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#f8f9fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.image || item.images?.[0]}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: breakpoint === "mobile" ? "14px" : "16px",
                      marginBottom: "2px",
                      color: "#1a1a1a",
                      fontWeight: 700,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.name}
                  </h3>
                  {item.variation && item.variation !== "default" && (
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "11px",
                        color: "#9ca3af",
                        marginBottom: "2px",
                      }}
                    >
                      Variant: {item.variation}
                    </p>
                  )}
                  <p
                    style={{
                      fontFamily: "'Nunito Sans', sans-serif",
                      fontSize: breakpoint === "mobile" ? "16px" : "18px",
                      color: "#1a1a1a",
                      fontWeight: 700,
                      marginBottom: "6px",
                    }}
                  >
                    ₹{(typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : item.price).toFixed(0)}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={() => removeFromCart(item.id, item.variation || "default")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontFamily: "'Inter', sans-serif",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <FaTrash size={10} /> Delete
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    overflow: "hidden",
                  }}
                >
                  <button
                    onClick={() => updateQuantity(item.id, item.variation || "default", item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    style={{
                      width: breakpoint === "mobile" ? "28px" : "32px",
                      height: breakpoint === "mobile" ? "28px" : "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f9fafb",
                      border: "none",
                      borderRight: "1px solid #e5e7eb",
                      cursor: item.quantity > 1 ? "pointer" : "not-allowed",
                      color: item.quantity > 1 ? "#1a1a1a" : "#d1d5db",
                    }}
                  >
                    <FaMinus size={10} />
                  </button>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      minWidth: breakpoint === "mobile" ? "28px" : "36px",
                      textAlign: "center",
                      color: "#1a1a1a",
                      background: "#fff",
                      lineHeight: breakpoint === "mobile" ? "28px" : "32px",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.variation || "default", item.quantity + 1)}
                    style={{
                      width: breakpoint === "mobile" ? "28px" : "32px",
                      height: breakpoint === "mobile" ? "28px" : "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f9fafb",
                      border: "none",
                      borderLeft: "1px solid #e5e7eb",
                      cursor: "pointer",
                      color: "#1a1a1a",
                    }}
                  >
                    <FaPlus size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {inProgressPacks.map((pack, idx) => {
            const min = pack.packPrice || pack.total || 0;
            const currentTotal = pack.total || 0;
            const progress = min > 0 ? Math.min((currentTotal / min) * 100, 100) : 0;
            return (
              <div
                key={`inprogress-${pack.packId}-${idx}`}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: breakpoint === "mobile" ? "12px" : "16px",
                  padding: breakpoint === "mobile" ? "12px" : "16px",
                  marginBottom: breakpoint === "mobile" ? "8px" : "12px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 1px 4px rgba(245,158,11,0.1)",
                  border: "1px solid #fef3c7",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: breakpoint === "mobile" ? "80px" : "100px",
                    height: breakpoint === "mobile" ? "80px" : "100px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#fffbeb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/assets/CustomizePack.jpeg"
                    alt="Customize Pack"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
                  <div>
                    <h3
                      style={{
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: breakpoint === "mobile" ? "14px" : "16px",
                        marginBottom: "2px",
                        color: "#1a1a1a",
                        fontWeight: 700,
                        lineHeight: 1.3,
                      }}
                    >
                      {pack.packName}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "11px",
                        color: "#9ca3af",
                        marginBottom: "4px",
                      }}
                    >
                      {pack.items?.reduce((total, item) => total + (item.quantity || 0), 0) || 0} items
                    </p>
                  </div>

                  <div style={{ margin: "4px 0" }}>
                    <div
                      style={{
                        height: "4px",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${progress}%`,
                          background: "linear-gradient(90deg, #f59e0b 0%, #eab308 100%)",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        marginTop: "4px",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "12px",
                        color: "#1a1a1a",
                        fontWeight: 600,
                      }}
                    >
                      ₹{currentTotal.toFixed(0)} / ₹{min.toFixed(0)}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    {currentTotal < min ? (
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "11px",
                          color: "#ef4444",
                          fontWeight: 600,
                          margin: 0,
                        }}
                      >
                        Add ₹{(min - currentTotal).toFixed(0)} more to{" "}
                        <Link
                          to={`/customize-pack/${pack.packId}`}
                          style={{
                            color: "#3b82f6",
                            textDecoration: "underline",
                          }}
                        >
                          complete
                        </Link>
                      </p>
                    ) : (
                      <button
                        onClick={() => finalizeInProgressPack(pack.packId)}
                        style={{
                          padding: "4px 10px",
                          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        Add to Cart
                      </button>
                    )}
                    <button
                      onClick={() => removeInProgressPack(pack.packId)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                        fontSize: "11px",
                        fontFamily: "'Inter', sans-serif",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                      }}
                    >
                      <FaTrash size={10} /> Discard
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {packItems.map((pack, index) => (
            <PackItemCard
              key={`pack-${pack.instanceId || index}`}
              pack={pack}
              index={index}
              breakpoint={breakpoint}
              removePackFromCart={removePackFromCart}
              updatePackQuantity={updatePackQuantity}
              navigate={navigate}
            />
          ))}
        </div>

        {(() => {
          const { totalItems, totalMRP, sellingTotal, totalDiscount, deliveryCharge, extraDiscount, freeShippingApplied, finalTotal } = checkoutSummary;

          const summaryRowStyle = {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
          };

          return (
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: breakpoint === "mobile" ? "16px" : "24px",
                borderRadius: "12px",
                marginBottom: "16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                border: "1px solid #e5e7eb",
              }}
            >
               <div style={{
                margin: "10px 0px 16px 0px",
                borderTop: "1px solid #f0f0f0",
                paddingTop: "16px",
              }}>
                <p style={{
                  margin: "0 0 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#6B7280",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}>
                  Apply Offer
                </p>

                <div style={{
                  display: "flex",
                  backgroundColor: "#F3F4F6",
                  borderRadius: 10,
                  padding: 3,
                  marginBottom: 14,
                }}>
                  <button
                    onClick={() => { setApplyMode('reward'); setCouponError(''); }}
                    style={{
                      flex: 1,
                      padding: "9px 12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      background: applyMode === 'reward' ? '#fff' : 'transparent',
                      color: applyMode === 'reward' ? '#111827' : '#9CA3AF',
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      fontFamily: "'Inter', sans-serif",
                      boxShadow: applyMode === 'reward' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <FaGift size={13} color={applyMode === 'reward' ? '#F59E0B' : '#9CA3AF'} /> Reward
                  </button>
                  <button
                    onClick={() => { setApplyMode('coupon'); setCouponError(''); }}
                    style={{
                      flex: 1,
                      padding: "9px 12px",
                      fontSize: "12px",
                      fontWeight: 600,
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      background: applyMode === 'coupon' ? '#fff' : 'transparent',
                      color: applyMode === 'coupon' ? '#111827' : '#9CA3AF',
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      fontFamily: "'Inter', sans-serif",
                      boxShadow: applyMode === 'coupon' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <FaTag size={13} color={applyMode === 'coupon' ? '#F59E0B' : '#9CA3AF'} /> Coupon
                  </button>
                </div>

                {(appliedReward || appliedCoupon) && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
                    borderRadius: 10,
                    border: "1px solid #FDE68A",
                    marginBottom: 10,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: "#FEF3C7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: '#fff',
                        fontSize: 14,
                      }}>
                        {appliedReward ? <FaGift size={14} /> : <FaTag size={14} />}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, fontFamily: "'Inter', sans-serif", color: "#92400E" }}>
                          {appliedReward ? appliedReward.label : appliedCoupon.code}
                        </p>
                        <p style={{ margin: "1px 0 0", fontSize: "10px", fontFamily: "'Inter', sans-serif", color: "#A16207" }}>
                          Applied successfully
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveApplied}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: "rgba(220,38,38,0.1)",
                        border: "none",
                        cursor: "pointer",
                        color: "#DC2626",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: 1,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.2)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)' }}
                    >
                      ×
                    </button>
                  </div>
                )}

                {applyMode === 'reward' && !appliedReward && !appliedCoupon && (
                  <div>
                    {!rewardsIdentifier ? (
                      <div style={{ textAlign: "center", padding: "20px 12px" }}>
                        <FaGift size={28} color="#D1D5DB" style={{ marginBottom: 8 }} />
                        <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0, fontFamily: "'Inter', sans-serif" }}>
                          Go to Rewards page to earn rewards
                        </p>
                      </div>
                    ) : unclaimedRewards.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "20px 12px" }}>
                        <FaGift size={28} color="#D1D5DB" style={{ marginBottom: 8 }} />
                        <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0, fontFamily: "'Inter', sans-serif" }}>
                          No unclaimed rewards available
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {unclaimedRewards.map((reward) => {
                          const rewardIcon = reward.type === 'discount_percent' ? <FaTag size={16} /> :
                            reward.type === 'reward_points' ? <FaGift size={16} /> :
                            reward.type === 'free_shipping' ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg> : null;
                          return (
                            <button
                              key={reward.id}
                              onClick={() => handleApplyReward(reward)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "12px 14px",
                                background: "#fff",
                                borderRadius: 10,
                                border: "1px solid #F3F4F6",
                                cursor: "pointer",
                                width: "100%",
                                textAlign: "left",
                                transition: "all 0.2s",
                                fontFamily: "'Inter', sans-serif",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FDE68A"; e.currentTarget.style.backgroundColor = "#FFFBEB"; e.currentTarget.style.boxShadow = '0 2px 8px rgba(245,158,11,0.08)' }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#F3F4F6"; e.currentTarget.style.backgroundColor = "#fff"; e.currentTarget.style.boxShadow = 'none' }}
                            >
                              <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: 10,
                                background: reward.type === 'discount_percent' ? '#FEF3C7' :
                                  reward.type === 'reward_points' ? '#DBEAFE' :
                                  '#D1FAE5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: reward.type === 'discount_percent' ? '#D97706' :
                                  reward.type === 'reward_points' ? '#2563EB' :
                                  '#059669',
                                flexShrink: 0,
                              }}>
                                {rewardIcon}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: "#111827" }}>
                                  {reward.label}
                                </p>
                                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#9CA3AF" }}>
                                  {reward.type === 'discount_percent' ? `${reward.value}% off on your order` :
                                   reward.type === 'reward_points' ? `${reward.value} reward points` :
                                   reward.type === 'free_shipping' ? 'Free shipping on next order' : ''}
                                </p>
                              </div>
                              <span style={{
                                padding: "5px 14px",
                                fontSize: "11px",
                                fontWeight: 600,
                                color: "#F59E0B",
                                backgroundColor: "#FEF3C7",
                                borderRadius: 6,
                              }}>
                                Apply
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {applyMode === 'coupon' && !appliedCoupon && !appliedReward && (
                  <div>
                    <div style={{
                      display: "flex",
                      border: `2px solid ${couponError ? '#FCA5A5' : '#E5E7EB'}`,
                      borderRadius: 10,
                      overflow: "hidden",
                      transition: 'border-color 0.2s',
                    }}
                      onFocus={() => {}}
                    >
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                        placeholder="Enter coupon code"
                        style={{
                          flex: 1,
                          padding: "11px 14px",
                          fontSize: "13px",
                          border: "none",
                          outline: "none",
                          boxSizing: "border-box",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontFamily: "'Inter', sans-serif",
                          color: '#111827',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.parentElement.style.borderColor = '#F59E0B';
                          e.currentTarget.parentElement.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.1)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.parentElement.style.boxShadow = 'none';
                          e.currentTarget.parentElement.style.borderColor = couponError ? '#FCA5A5' : '#E5E7EB';
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleApplyCoupon() }}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        style={{
                          padding: "11px 20px",
                          fontSize: "12px",
                          fontWeight: 600,
                          border: "none",
                          cursor: couponCode.trim() ? "pointer" : "not-allowed",
                          background: couponCode.trim()
                            ? "linear-gradient(135deg, #F59E0B, #D97706)"
                            : "#F3F4F6",
                          color: couponCode.trim() ? "#fff" : "#9CA3AF",
                          fontFamily: "'Inter', sans-serif",
                          whiteSpace: "nowrap",
                          transition: 'all 0.2s',
                        }}
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p style={{
                        margin: "6px 0 0",
                        fontSize: "11px",
                        color: "#EF4444",
                        fontFamily: "'Inter', sans-serif",
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        {couponError}
                      </p>
                    )}
                  </div>
                )}

              </div>
              <h2
                style={{
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: breakpoint === "mobile" ? "16px" : "18px",
                  marginBottom: "12px",
                  color: "#1f2937",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                Price Details ({totalItems} {totalItems === 1 ? "Item" : "Items"})
              </h2>

              <div style={{ borderTop: "1px solid #f0f0f0" }}>
                {/* Total MRP */}
                <div style={summaryRowStyle}>
                  <span style={{ color: "#4b5563" }}>Total MRP</span>
                  <span style={{ color: "#4b5563" }}>₹{totalMRP.toFixed(2)}</span>
                </div>

                {/* Discount on MRP */}
                {totalDiscount > 0 && (
                  <div style={summaryRowStyle}>
                    <span style={{ color: "#16a34a" }}>Discount on MRP</span>
                    <span style={{ color: "#16a34a", fontWeight: 600 }}>
                      − ₹{totalDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Subtotal */}
                <div style={summaryRowStyle}>
                  <span style={{ color: "#4b5563" }}>Subtotal</span>
                  <span style={{ color: "#4b5563", fontWeight: 600 }}>₹{sellingTotal.toFixed(2)}</span>
                </div>

                {/* Delivery Charges */}
                <div style={{ ...summaryRowStyle }}>
                  <span style={{ color: "#4b5563" }}>Delivery Charges</span>
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>FREE</span>
                </div>

                {/* Reward / Coupon Discount */}
                {extraDiscount > 0 && (
                  <div style={{ ...summaryRowStyle }}>
                    <span style={{ color: "#F59E0B" }}>
                      {appliedReward ? 'Reward Discount' : 'Coupon Discount'}
                    </span>
                    <span style={{ color: "#F59E0B", fontWeight: 600 }}>
                      − ₹{extraDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                {freeShippingApplied && (
                  <div style={{ ...summaryRowStyle }}>
                    <span style={{ color: "#F59E0B" }}>Free Shipping</span>
                    <span style={{ color: "#16a34a", fontWeight: 600 }}>Applied ✓</span>
                  </div>
                )}

                {/* Grand Total */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 0 4px 0",
                    borderTop: "1px dashed #e5e7eb",
                    marginTop: "4px",
                    fontFamily: "'Nunito Sans', sans-serif",
                  }}
                >
                  <span
                    style={{
                      fontSize: breakpoint === "mobile" ? "16px" : "17px",
                      color: "#1f2937",
                      fontWeight: 700,
                    }}
                  >
                    Total Amount
                  </span>
                  <span
                    style={{
                      fontSize: breakpoint === "mobile" ? "18px" : "20px",
                      color: "#1f2937",
                      fontWeight: 800,
                    }}
                  >
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Savings Banner */}
              {totalDiscount > 0 && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "10px 14px",
                    background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                    borderRadius: "8px",
                    border: "1px solid #a7f3d0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "13px",
                      color: "#15803d",
                      fontWeight: 600,
                    }}
                  >
                    You will save ₹{totalDiscount.toFixed(2)} on this order
                  </span>
                </div>
              )}
            </div>
          );
        })()}

        <button
          onClick={() => navigate("/checkout", {
            state: { appliedReward, appliedCoupon }
          })}
          style={{
            width: "100%",
            padding: breakpoint === "mobile" ? "13px" : "15px",
            fontFamily: "'Inter', sans-serif",
            fontSize: breakpoint === "mobile" ? "14px" : "16px",
            background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
            color: "#1f2937",
            fontWeight: 700,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 8px rgba(245,158,11,0.25)",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 4px 12px rgba(245,158,11,0.35)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 8px rgba(245,158,11,0.25)";
          }}
        >
          Proceed to Checkout ({cartItems.reduce((s, i) => s + i.quantity, 0) + packItems.reduce((s, p) => s + p.quantity, 0)} items)
        </button>


      </div>
    </div>
  );
};

export default Cart;