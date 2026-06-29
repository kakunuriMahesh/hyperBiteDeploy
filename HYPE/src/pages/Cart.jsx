import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../store/hooks/useCart";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash, FaPlus, FaMinus, FaEdit, FaChevronDown, FaChevronUp, FaArrowLeft, FaGift, FaTag } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  selectIdentifier,
  selectUnclaimedRewards,
  claimReward,
} from "../store/slices/rewardsSlice";
import { validateCoupon, validateReward, checkIdentifier } from "../utils/api";
import { fetchSettings } from "../config/settings";

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
              ₹{(pack.packPrice || 0).toFixed(0)}
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
              const pDetails = item.name || item.id;
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
                  <span>{pDetails}</span>
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
  const [couponLoading, setCouponLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(85);

  useEffect(() => {
    fetchSettings().then(s => {
      if (s?.deliveryCharge) setDeliveryCharge(s.deliveryCharge);
    });
  }, []);

  // Identifier lookup
  const [lookupValue, setLookupValue] = useState(rewardsIdentifier || '');
  const [lookupData, setLookupData] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const aggregatedRewards = useMemo(() => {
    if (!lookupData?.rewards) return [];
    const pointsRewards = lookupData.rewards.filter(r => r.type === 'reward_points');
    const otherRewards = lookupData.rewards.filter(r => r.type !== 'reward_points');
    const activePts = pointsRewards.filter(r => !r.claimed);
    const totalPts = activePts.reduce((s, r) => s + r.value, 0);
    const aggregated = totalPts > 0 ? [{
      id: 'cart-points-total',
      type: 'reward_points',
      value: totalPts,
      label: `${totalPts} Reward Points Total`,
      claimed: false,
      isAggregated: true,
    }] : [];
    return [...aggregated, ...otherRewards];
  }, [lookupData]);

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
    let extraDiscount = 0;
    let freeShippingApplied = false;
    if (appliedReward) {
      if (appliedReward.type === 'discount_percent') {
        extraDiscount = sellingTotal * (appliedReward.value / 100);
      }
      if (appliedReward.type === 'discount_fixed') {
        extraDiscount = appliedReward.value;
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
  }, [cartItems, packItems, getCartTotal, appliedReward, appliedCoupon, deliveryCharge]);

  const saveCartState = (overrides = {}) => {
    try {
      const current = JSON.parse(localStorage.getItem('cart_lookup') || '{}');
      localStorage.setItem('cart_lookup', JSON.stringify({ ...current, ...overrides }));
    } catch {}
  };

  const handleApplyReward = (reward, fromLookup) => {
    if (appliedReward && appliedReward.id === reward.id) {
      setAppliedReward(null);
      saveCartState({ appliedReward: null, appliedCoupon: null, couponCode: '' });
      return;
    }
    setAppliedReward(reward);
    setAppliedCoupon(null);
    setCouponCode('');
    if (!fromLookup) {
      dispatchRewards(claimReward(reward.id));
    }
    toast.success(`${reward.label} applied!`);
    saveCartState({ appliedReward: reward, appliedCoupon: null, couponCode: '' });
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    const code = couponCode.trim().toUpperCase();
    setCouponLoading(true);
    setCouponError('');
    try {
      const result = await validateCoupon(code, lookupValue || rewardsIdentifier, checkoutSummary.sellingTotal);
      if (!result.valid) {
        setCouponError(result.reason || 'Invalid coupon code');
        return;
      }
      setAppliedCoupon(result.coupon);
      setAppliedReward(null);
      toast.success(`Coupon ${code} applied!`);
      saveCartState({ appliedCoupon: result.coupon, appliedReward: null, couponCode: '' });
    } catch (err) {
      setCouponError('Failed to validate coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleLookup = async () => {
    const val = lookupValue.trim();
    if (!val) return;
    setLookupLoading(true);
    setLookupError('');
    setAppliedCoupon(null);
    setAppliedReward(null);
    setCouponCode('');
    setCouponError('');
    try {
      const data = await checkIdentifier(val);
      setLookupData(data);
      saveCartState({ lookupValue: val, lookupData: data, appliedCoupon: null, appliedReward: null, couponCode: '' });
    } catch (err) {
      setLookupError(err.message);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleApplyOfferCoupon = async (offerCode) => {
    setCouponLoading(true);
    setCouponError('');
    try {
      const result = await validateCoupon(offerCode, lookupValue || rewardsIdentifier, checkoutSummary.sellingTotal);
      if (!result.valid) {
        setCouponError(result.reason || 'Cannot apply this coupon');
        return;
      }
      setAppliedCoupon(result.coupon);
      setAppliedReward(null);
      setCouponCode('');
      toast.success(`Coupon ${offerCode} applied!`);
      saveCartState({ appliedCoupon: result.coupon, appliedReward: null, couponCode: '' });
    } catch (err) {
      setCouponError('Failed to apply coupon.');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveApplied = () => {
    setAppliedReward(null);
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    saveCartState({ appliedReward: null, appliedCoupon: null, couponCode: '' });
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

  // Auto-fetch rewards & offers on mount
  useEffect(() => {
    if (rewardsIdentifier) {
      setLookupValue(rewardsIdentifier);
      (async () => {
        setLookupLoading(true);
        try {
          const data = await checkIdentifier(rewardsIdentifier);
          setLookupData(data);
        } catch (err) {
          // silent
        } finally {
          setLookupLoading(false);
        }
      })();
    }
  }, [rewardsIdentifier]);

  const location = useLocation();

  // Restore lookup + applied state from localStorage on mount
  useEffect(() => {
    if (location.state?.clearApplied) {
      localStorage.removeItem('cart_lookup');
      window.history.replaceState({}, document.title);
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem('cart_lookup'));
      if (saved) {
        if (saved.lookupValue && saved.lookupData) {
          setLookupValue(saved.lookupValue);
          setLookupData(saved.lookupData);
        }
        if (saved.appliedCoupon) {
          setAppliedCoupon(saved.appliedCoupon);
          setAppliedReward(null);
        } else if (saved.appliedReward) {
          setAppliedReward(saved.appliedReward);
          setAppliedCoupon(null);
        }
      }
    } catch {}
  }, []);

  // Auto-remove applied coupon if cart total drops below minCartValue
  useEffect(() => {
    const sellingTotal = checkoutSummary.sellingTotal;
    if (!appliedCoupon || !lookupData) return;

    let minCart = appliedCoupon.minCartValue || 0;
    if (!minCart && lookupData.offerCoupons) {
      const matched = lookupData.offerCoupons.find(o => o.code === appliedCoupon.code);
      if (matched) minCart = matched.minCartValue || 0;
    }
    if (!minCart && lookupData.agent && appliedCoupon.code === lookupData.agent.personalCode) {
      minCart = lookupData.agent.personalMinCartValue || 0;
    }
    if (!minCart && lookupData.referralAgent && appliedCoupon.code === lookupData.referralAgent.referralCode) {
      minCart = lookupData.referralAgent.referralMinCartValue || 0;
    }

    if (minCart > 0 && sellingTotal < minCart) {
      setAppliedCoupon(null);
      setCouponCode('');
      saveCartState({ appliedCoupon: null, appliedReward, couponCode: '' });
      toast.info(`Coupon removed — minimum cart value of ₹${minCart} no longer met`);
    }
  }, [checkoutSummary.sellingTotal, appliedCoupon, lookupData, appliedReward]);

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

        <div style={{
          display: "flex",
          flexDirection: breakpoint === "mobile" ? "column" : "row",
          gap: breakpoint === "mobile" ? "0" : "24px",
          alignItems: breakpoint === "mobile" ? "stretch" : "flex-start",
        }}>
        <div style={{ flex: 1, minWidth: 0, width: breakpoint === "mobile" ? "100%" : "auto" }}>
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
        </div>

        <div style={{
          ...(breakpoint === "mobile" ? { width: "100%" } : { flex: "0 0 380px", position: "sticky", top: 104 }),
        }}>
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
                  Email/Phone
                </p>

                {/* Identifier Lookup */}
                <div style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: lookupData ? 8 : 14,
                }}>
                  <input
                    type="text"
                    value={lookupValue}
                    onChange={(e) => { setLookupValue(e.target.value); setLookupData(null); localStorage.removeItem('cart_lookup'); }}
                    placeholder="Enter email/phone to check rewards & offers"
                    style={{
                      flex: 1,
                      padding: "9px 12px",
                      fontSize: "12px",
                      border: `2px solid ${lookupError ? '#FCA5A5' : '#E5E7EB'}`,
                      borderRadius: 8,
                      outline: "none",
                      fontFamily: "'Inter', sans-serif",
                      color: '#111827',
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleLookup() }}
                  />
                  <button
                    onClick={handleLookup}
                    disabled={!lookupValue.trim() || lookupLoading}
                    style={{
                      padding: "9px 16px",
                      fontSize: "12px",
                      fontWeight: 600,
                      border: "none",
                      borderRadius: 8,
                      cursor: lookupValue.trim() && !lookupLoading ? "pointer" : "not-allowed",
                      background: lookupValue.trim() && !lookupLoading
                        ? "linear-gradient(135deg, #6366f1, #4f46e5)"
                        : "#F3F4F6",
                      color: lookupValue.trim() && !lookupLoading ? "#fff" : "#9CA3AF",
                      fontFamily: "'Inter', sans-serif",
                      whiteSpace: "nowrap",
                      transition: 'all 0.2s',
                    }}
                  >
                    {lookupLoading ? '...' : 'Verify'}
                  </button>
                </div>

                {lookupError && (
                  <p style={{ margin: "0 0 12px", fontSize: "11px", color: "#EF4444", fontFamily: "'Inter', sans-serif" }}>
                    {lookupError}
                  </p>
                )}

                {lookupData && lookupData.totalPoints > 0 && lookupData.hasRewards === false && lookupData.hasOffers === false && !lookupData.agent && !lookupData.referralAgent && (
                  <p style={{ margin: "0 0 14px", fontSize: "11px", color: "#9CA3AF", fontFamily: "'Inter', sans-serif", textAlign: "center", padding: "10px 0" }}>
                    No rewards or offers found for this identifier
                  </p>
                )}

                {!lookupData ? (
                  <div style={{ textAlign: "center", padding: "20px 12px" }}>
                    <FaTag size={28} color="#D1D5DB" style={{ marginBottom: 8 }} />
                    <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0, fontFamily: "'Inter', sans-serif" }}>
                      Enter your email/phone above and verify to see available rewards & coupons
                    </p>
                  </div>
                ) : (<>
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
                    {lookupData?.hasRewards && lookupData.rewards.length > 0 && (
                      <span style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        background: applyMode === 'reward' ? '#F59E0B' : '#D1D5DB',
                        color: applyMode === 'reward' ? '#fff' : '#6B7280',
                        borderRadius: 10,
                        padding: "1px 6px",
                        minWidth: 18,
                        textAlign: "center",
                        lineHeight: "16px",
                      }}>
                        {lookupData.rewards.length}
                      </span>
                    )}
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
                    {(() => {
                      const offerCount = lookupData?.offerCoupons?.filter(o => !o.usedByCurrentUser)?.length || 0;
                      const agentCount = lookupData?.agent ? 1 : 0;
                      const referralCount = !lookupData?.agent && lookupData?.referralAgent ? 1 : 0;
                      const total = offerCount + agentCount + referralCount;
                      return total > 0 ? (
                        <span style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          background: applyMode === 'coupon' ? '#F59E0B' : '#D1D5DB',
                          color: applyMode === 'coupon' ? '#fff' : '#6B7280',
                          borderRadius: 10,
                          padding: "1px 6px",
                          minWidth: 18,
                          textAlign: "center",
                          lineHeight: "16px",
                        }}>
                          {total}
                        </span>
                      ) : null;
                    })()}
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
                          {appliedReward
                            ? appliedReward.type === 'discount_percent' ? `${appliedReward.value}% OFF`
                              : appliedReward.type === 'discount_fixed' ? `₹${appliedReward.value} OFF`
                              : appliedReward.type === 'free_shipping' ? 'Free Shipping'
                              : 'Applied successfully'
                            : appliedCoupon.discount > 0 && appliedCoupon.freeShipping
                              ? `${appliedCoupon.discount}% OFF + Free Shipping`
                              : appliedCoupon.discount > 0 ? `${appliedCoupon.discount}% OFF`
                              : appliedCoupon.freeShipping ? 'Free Shipping'
                              : 'Applied successfully'}
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
                    {/* Show lookup rewards if available */}
                    {lookupData && lookupData.hasRewards ? (
                      <div>
                        <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 600, color: "#6B7280", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Your Rewards ({lookupData.totalPoints} points)
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {aggregatedRewards.map((r) => (
                            <button
                              key={r.id}
                              onClick={() => r.isAggregated ? null : handleApplyReward(r, true)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 12px",
                                background: "#FFFBEB",
                                borderRadius: 8,
                                border: "1px solid #FDE68A",
                                cursor: r.isAggregated ? "default" : "pointer",
                                width: "100%",
                                textAlign: "left",
                                fontFamily: "'Inter', sans-serif",
                                transition: "all 0.2s",
                                opacity: r.isAggregated ? 0.8 : 1,
                              }}
                              onMouseEnter={(e) => { if (!r.isAggregated) { e.currentTarget.style.borderColor = "#F59E0B"; e.currentTarget.style.backgroundColor = "#FEF3C7"; } }}
                              onMouseLeave={(e) => { if (!r.isAggregated) { e.currentTarget.style.borderColor = "#FDE68A"; e.currentTarget.style.backgroundColor = "#FFFBEB"; } }}
                            >
                              <FaGift size={14} color="#F59E0B" />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <span style={{ fontSize: "12px", fontWeight: 600, color: "#92400E" }}>{r.label}</span>
                                {r.expiresAt && r.type !== 'reward_points' && (
                                  <span style={{ display: "block", fontSize: "10px", color: "#A16207", marginTop: 1 }}>
                                    Expires {new Date(r.expiresAt).toLocaleDateString("en-IN")}
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: "11px", padding: "3px 10px", background: r.isAggregated ? "#F0FFFD" : "#FEF3C7", borderRadius: 4, color: r.isAggregated ? "#4ECDC4" : "#D97706", fontWeight: 600 }}>
                                {r.isAggregated ? `${r.value} PTS` : 'Apply'}
                              </span>
                            </button>
                          ))}                          </div>
                      </div>
                    ) : lookupData ? (
                      <div style={{ textAlign: "center", padding: "20px 12px" }}>
                        <FaGift size={28} color="#D1D5DB" style={{ marginBottom: 8 }} />
                        <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0, fontFamily: "'Inter', sans-serif" }}>
                          No rewards available
                        </p>
                      </div>
                    ) : !rewardsIdentifier ? (
                      <div style={{ textAlign: "center", padding: "20px 12px" }}>
                        <FaGift size={28} color="#D1D5DB" style={{ marginBottom: 8 }} />
                        <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0, fontFamily: "'Inter', sans-serif" }}>
                          Go to Rewards page to earn rewards
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
                                   reward.type === 'discount_fixed' ? `₹${reward.value} off on your order` :
                                   reward.type === 'reward_points' ? `${reward.value} reward points` :
                                   reward.type === 'free_shipping' ? 'Free shipping on next order' : ''}
                                </p>
                                {reward.expiresAt && (
                                  <p style={{ margin: "1px 0 0", fontSize: "10px", color: "#DC2626" }}>
                                    Expires {new Date(reward.expiresAt).toLocaleDateString("en-IN")}
                                  </p>
                                )}
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
                </>)}
                {lookupData && applyMode === 'coupon' && !appliedCoupon && !appliedReward && (
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
                        disabled={!couponCode.trim() || couponLoading}
                        style={{
                          padding: "11px 20px",
                          fontSize: "12px",
                          fontWeight: 600,
                          border: "none",
                          cursor: couponCode.trim() && !couponLoading ? "pointer" : "not-allowed",
                          background: couponCode.trim() && !couponLoading
                            ? "linear-gradient(135deg, #F59E0B, #D97706)"
                            : "#F3F4F6",
                          color: couponCode.trim() && !couponLoading ? "#fff" : "#9CA3AF",
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

                    {/* Available Coupons — offer coupons only */}
                    {lookupData?.hasOffers && (
                      <div style={{ marginTop: 12 }}>
                        <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 600, color: "#6B7280", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Available Coupons
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {lookupData.offerCoupons.filter(o => !o.usedByCurrentUser).map((o) => {
                            const eligible = sellingTotal >= (o.minCartValue || 0);
                            return (
                              <button
                                key={o.id}
                                onClick={() => eligible && handleApplyOfferCoupon(o.code)}
                                disabled={!eligible}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "8px 12px",
                                  background: eligible ? "#F0FDF4" : "#F9FAFB",
                                  borderRadius: 8,
                                  border: `1px solid ${eligible ? '#BBF7D0' : '#E5E7EB'}`,
                                  cursor: eligible ? "pointer" : "not-allowed",
                                  width: "100%",
                                  textAlign: "left",
                                  fontFamily: "'Inter', sans-serif",
                                  transition: "all 0.2s",
                                  opacity: eligible ? 1 : 0.6,
                                }}
                                onMouseEnter={(e) => { if (eligible) { e.currentTarget.style.borderColor = "#22C55E"; e.currentTarget.style.backgroundColor = "#DCFCE7"; }}}
                                onMouseLeave={(e) => { if (eligible) { e.currentTarget.style.borderColor = "#BBF7D0"; e.currentTarget.style.backgroundColor = "#F0FDF4"; }}}
                              >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <span style={{ fontSize: "12px", fontWeight: 600, color: eligible ? "#166534" : "#9CA3AF" }}>
                                    {o.code} {o.discount > 0 ? `- ${o.discount}% OFF` : ''} {o.freeShipping ? '• Free Shipping' : ''}
                                  </span>
                                  {!eligible && o.minCartValue > 0 && (
                                    <p style={{ margin: "2px 0 0", fontSize: "10px", color: "#9CA3AF" }}>Min order: ₹{o.minCartValue}</p>
                                  )}
                                </div>
                                <span style={{ fontSize: "11px", padding: "2px 10px", background: eligible ? "#DCFCE7" : "#F3F4F6", borderRadius: 4, color: eligible ? "#16A34A" : "#9CA3AF", fontWeight: 600, whiteSpace: "nowrap" }}>
                                  {eligible ? 'Apply' : 'Locked'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Your Codes — collaborator / referral codes (shown below in a distinct section) */}
                    {(lookupData?.agent || lookupData?.referralAgent) && (
                      <div style={{ marginTop: lookupData?.hasOffers ? 16 : 12 }}>
                        <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 600, color: "#6B7280", fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Your Codes
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {lookupData.agent && (() => {
                            const minCart = lookupData.agent.personalMinCartValue || 0;
                            const eligible = sellingTotal >= minCart;
                            return (
                              <button
                                onClick={() => eligible && handleApplyOfferCoupon(lookupData.agent.personalCode)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "8px 12px",
                                  background: eligible ? "#F0F0FF" : "#F9FAFB",
                                  borderRadius: 8,
                                  border: `1px solid ${eligible ? '#C7D2FE' : '#E5E7EB'}`,
                                  cursor: eligible ? "pointer" : "not-allowed",
                                  width: "100%",
                                  textAlign: "left",
                                  fontFamily: "'Inter', sans-serif",
                                  transition: "all 0.2s",
                                  opacity: eligible ? 1 : 0.6,
                                }}
                                onMouseEnter={(e) => { if (eligible) { e.currentTarget.style.borderColor = "#818CF8"; e.currentTarget.style.backgroundColor = "#E0E7FF"; }}}
                                onMouseLeave={(e) => { if (eligible) { e.currentTarget.style.borderColor = "#C7D2FE"; e.currentTarget.style.backgroundColor = "#F0F0FF"; }}}
                              >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <span style={{ fontSize: "12px", fontWeight: 600, color: eligible ? "#4338CA" : "#9CA3AF" }}>
                                    {lookupData.agent.personalCode} — {lookupData.agent.personalDiscountPercent}% off
                                  </span>
                                  <p style={{ margin: "1px 0 0", fontSize: "10px", color: eligible ? "#818CF8" : "#9CA3AF" }}>
                                    Collaborator code{!eligible && minCart > 0 ? ` • Min ₹${minCart}` : ''}
                                  </p>
                                </div>
                                <span style={{ fontSize: "11px", padding: "2px 10px", background: eligible ? "#E0E7FF" : "#F3F4F6", borderRadius: 4, color: eligible ? "#4F46E5" : "#9CA3AF", fontWeight: 600 }}>{eligible ? 'Apply' : 'Locked'}</span>
                              </button>
                            );
                          })()}
                          {!lookupData.agent && lookupData.referralAgent && (() => {
                            const minCart = lookupData.referralAgent.referralMinCartValue || 0;
                            const eligible = sellingTotal >= minCart;
                            return (
                              <button
                                onClick={() => eligible && handleApplyOfferCoupon(lookupData.referralAgent.referralCode)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "8px 12px",
                                  background: eligible ? "#FAF5FF" : "#F9FAFB",
                                  borderRadius: 8,
                                  border: `1px solid ${eligible ? '#E9D5FF' : '#E5E7EB'}`,
                                  cursor: eligible ? "pointer" : "not-allowed",
                                  width: "100%",
                                  textAlign: "left",
                                  fontFamily: "'Inter', sans-serif",
                                  transition: "all 0.2s",
                                  opacity: eligible ? 1 : 0.6,
                                }}
                                onMouseEnter={(e) => { if (eligible) { e.currentTarget.style.borderColor = "#C084FC"; e.currentTarget.style.backgroundColor = "#F3E8FF"; }}}
                                onMouseLeave={(e) => { if (eligible) { e.currentTarget.style.borderColor = "#E9D5FF"; e.currentTarget.style.backgroundColor = "#FAF5FF"; }}}
                              >
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <span style={{ fontSize: "12px", fontWeight: 600, color: eligible ? "#7C3AED" : "#9CA3AF" }}>
                                    {lookupData.referralAgent.referralCode}
                                  </span>
                                  <p style={{ margin: "1px 0 0", fontSize: "10px", color: eligible ? "#A855F7" : "#9CA3AF" }}>
                                    Referral code{!eligible && minCart > 0 ? ` • Min ₹${minCart}` : ''}
                                  </p>
                                </div>
                                <span style={{ fontSize: "11px", padding: "2px 10px", background: eligible ? "#F3E8FF" : "#F3F4F6", borderRadius: 4, color: eligible ? "#9333EA" : "#9CA3AF", fontWeight: 600 }}>{eligible ? 'Apply' : 'Locked'}</span>
                              </button>
                            );
                          })()}
                        </div>
                      </div>
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
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>
                    <span style={{ textDecoration: 'line-through', color: '#999', marginRight: 6 }}>₹{deliveryCharge}</span>
                    FREE
                  </span>
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
          onClick={async () => {
            if (!lookupData) {
              toast.warning('Please verify your email/phone before proceeding');
              return;
            }
            setCheckoutLoading(true);
            try {
              const verifiedId = lookupValue || rewardsIdentifier;
              if (appliedReward && appliedReward.id) {
                const result = await validateReward(appliedReward.id, verifiedId, checkoutSummary.sellingTotal);
                if (!result.valid) {
                  toast.error(result.reason || 'Applied reward is no longer valid');
                  setAppliedReward(null);
                  return;
                }
              }
              if (appliedCoupon && appliedCoupon.code) {
                const result = await validateCoupon(appliedCoupon.code, verifiedId, checkoutSummary.sellingTotal);
                if (!result.valid) {
                  toast.error(result.reason || 'Applied coupon is no longer valid');
                  setAppliedCoupon(null);
                  setCouponCode('');
                  return;
                }
              }
              navigate("/checkout", { state: { appliedReward, appliedCoupon, verifiedIdentifier: verifiedId } });
            } catch {
              toast.error('Unable to validate discounts. Please try again.');
            } finally {
              setCheckoutLoading(false);
            }
          }}
          disabled={checkoutLoading}
          style={{
            width: "100%",
            padding: breakpoint === "mobile" ? "13px" : "15px",
            fontFamily: "'Inter', sans-serif",
            fontSize: breakpoint === "mobile" ? "14px" : "16px",
            background: checkoutLoading ? "#9CA3AF" : (!lookupData ? "#D1D5DB" : "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)"),
            color: checkoutLoading || !lookupData ? "#fff" : "#1f2937",
            fontWeight: 700,
            border: "none",
            borderRadius: "8px",
            cursor: checkoutLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            boxShadow: checkoutLoading ? "none" : (!lookupData ? "none" : "0 2px 8px rgba(245,158,11,0.25)"),
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
          {checkoutLoading ? 'Validating...' : `Proceed to Checkout (${cartItems.reduce((s, i) => s + i.quantity, 0) + packItems.reduce((s, p) => s + p.quantity, 0)} items)`}
        </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Cart;