import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../store/hooks/useCart";
import { formatCartMessage } from "../utils/whatsapp";
import { getCookie, setCookie } from "../utils/cookies";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { toast } from "react-toastify";
import { allowedPincodes } from "../config/allowedPincodes";
import { fetchSettings } from "../config/settings";
import { validateCoupon, validateReward } from "../utils/api";
import Navbar from "../components/Navbar";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    cartItems,
    packItems,
    pincode,
    getCartTotal,
    clearCart,
  } = useCart();

  const routeState = location.state || {};
  const savedCartLookup = (() => { try { return JSON.parse(localStorage.getItem('cart_lookup') || '{}'); } catch { return {}; } })();
  const [appliedReward] = useState(routeState.appliedReward || savedCartLookup.appliedReward || null);
  const [appliedCoupon] = useState(routeState.appliedCoupon || savedCartLookup.appliedCoupon || null);

  const [breakpoint, setBreakpoint] = useState("desktop");
  const isDesktop = breakpoint !== "mobile";
  const [orderExpanded, setOrderExpanded] = useState(window.innerWidth >= 768);
  const [phoneValue, setPhoneValue] = useState();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [pincodeError, setPincodeError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({ points: 0, email: '' });
  const [deliveryCharge, setDeliveryCharge] = useState(85);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    fetchSettings().then(s => {
      if (s?.deliveryCharge) setDeliveryCharge(s.deliveryCharge);
    });
  }, []);

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

  useEffect(() => {
    const updateBreakpoint = () => {
      const viewportWidth = window.innerWidth;
      const newBP = viewportWidth < 768 ? "mobile" : viewportWidth < 1024 ? "tablet" : "desktop";
      setBreakpoint(newBP);
      if (newBP !== "mobile") {
        setOrderExpanded(true);
      }
    };
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  useEffect(() => {
    const savedDetails = getCookie("userDetails");
    if (savedDetails) {
      delete savedDetails.phone;
      setFormData(savedDetails);
    }
    if (pincode) {
      setFormData((prev) => ({ ...prev, pincode }));
    }
  }, [pincode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "pincode") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, pincode: digitsOnly }));
    } else if (name === "city" || name === "state" || name === "country") {
      const noDigits = value.replace(/\d/g, "");
      setFormData((prev) => ({ ...prev, [name]: noDigits }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (name === "pincode") setPincodeError("");
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name?.trim()) errors.name = "Full Name is required";
    if (!phoneValue) {
      errors.phone = "Phone Number is required";
    } else if (!isValidPhoneNumber(phoneValue)) {
      errors.phone = "Enter a valid phone number";
    }
    if (!formData.pincode?.trim()) {
      errors.pincode = "Pincode is required";
    } else if (formData.pincode.length !== 6) {
      errors.pincode = "Pincode must be exactly 6 digits";
    }
    if (!formData.city?.trim()) {
      errors.city = "City is required";
    } else if (/\d/.test(formData.city)) {
      errors.city = "City should not contain numbers";
    }
    if (!formData.state?.trim()) {
      errors.state = "State is required";
    } else if (/\d/.test(formData.state)) {
      errors.state = "State should not contain numbers";
    }
    if (!formData.country?.trim()) {
      errors.country = "Country is required";
    } else if (/\d/.test(formData.country)) {
      errors.country = "Country should not contain numbers";
    }
    if (!formData.address?.trim()) {
      errors.address = "Address is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayNow = async () => {
    if (!validateForm()) return;

    const verifiedId = routeState.verifiedIdentifier || savedCartLookup.lookupValue;
    const sellingTotal = getCartTotal();

    if (appliedReward && appliedReward.id) {
      const result = await validateReward(appliedReward.id, verifiedId, sellingTotal);
      if (!result.valid) {
        setValidationError(result.reason || 'Applied reward is no longer valid');
        return;
      }
      if (result.reward) {
        const mismatches = [];
        if (result.reward.type !== appliedReward.type) mismatches.push('reward type');
        if (result.reward.value !== appliedReward.value) mismatches.push('reward value');
        if (result.reward.minCartValue > sellingTotal) mismatches.push('minimum cart value');
        if (mismatches.length > 0) {
          setValidationError(`Applied reward no longer matches: ${mismatches.join(', ')} changed`);
          return;
        }
      }
    }
    if (appliedCoupon && appliedCoupon.code) {
      const result = await validateCoupon(appliedCoupon.code, verifiedId, sellingTotal);
      if (!result.valid) {
        setValidationError(result.reason || 'Applied coupon is no longer valid');
        return;
      }
      if (result.coupon) {
        const mismatches = [];
        if (result.coupon.discount !== appliedCoupon.discount) mismatches.push('discount percentage');
        if (result.coupon.freeShipping !== appliedCoupon.freeShipping) mismatches.push('free shipping');
        if (result.coupon.minCartValue > sellingTotal) mismatches.push('minimum cart value');
        if (mismatches.length > 0) {
          setValidationError(`Applied coupon no longer matches: ${mismatches.join(', ')} changed`);
          return;
        }
      }
    }

    initiateRazorpay();
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrderPayload = () => {
    const items = [];
    cartItems.forEach((it) => {
      const price = typeof it.price === 'string' ? parseFloat(it.price.replace(/[^0-9.]/g, '')) : Number(it.price);
      items.push({
        id: it.id,
        name: it.name + (it.variation && it.variation !== "default" ? ` (${it.variation})` : ""),
        price: price || 0,
        quantity: it.quantity || 1,
        type: "product",
      });
    });
    packItems.forEach((p) => {
      const subItems = (p.items || []).map((sub) => {
        const detail = sub.name || sub.id;
        return { id: sub.id, name: detail, quantity: sub.quantity || 1 };
      });
      items.push({
        id: p.packId || p.instanceId,
        name: p.packName,
        price: Number(p.packPrice) || 0,
        quantity: p.quantity || 1,
        type: "pack",
        subItems,
      });
    });
    return {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: phoneValue,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
      },
      items,
      customerIdentifier: routeState.verifiedIdentifier || phoneValue || null,
      appliedReward: appliedReward || null,
      appliedCoupon: appliedCoupon || null,
      finalAmount: checkoutSummary.finalTotal,
    };
  };

  const handleFreeOrder = async () => {
    setIsPaymentLoading(true);
    try {
      const resp = await fetch("https://hyperbitedeploy.onrender.com/api/payment/create-order", {
      // const resp = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createOrderPayload()),
      });
      if (resp.ok) {
        const data = await resp.json();
        setRazorpayOrderId(data.orderId);
      }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
    clearCart();
    setIsPaymentLoading(false);
    setSuccessData({ points: 0, email: formData.email });
    setShowSuccessModal(true);
  };

  const initiateRazorpay = async () => {
    if (!formData.pincode.trim()) {
      setPincodeError("Please enter a pincode");
      return;
    }

    if (checkoutSummary.finalTotal <= 0) {
      await handleFreeOrder();
      return;
    }

    try {
      setIsPaymentLoading(true);

      const resp = await fetch("https://hyperbitedeploy.onrender.com/api/payment/create-order", {
      // const resp = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createOrderPayload()),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Could not create order");
      }

      const data = await resp.json();

      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Razorpay SDK failed to load. Check your connection.");

      const options = {
        key: data.keyId,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency || "INR",
        name: "Hyperbite",
        description: "Order Payment",
        order_id: data.razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch("https://hyperbitedeploy.onrender.com/api/payment/verify", {
            // const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            const verifyJson = await verifyRes.json();
            if (verifyRes.ok && verifyJson.success) {
              const paidAmount = Math.round((data.razorpayOrder.amount || 0) / 100);
              clearCart();
              setIsPaymentLoading(false);
              setSuccessData({ points: paidAmount, email: formData.email });
              setShowSuccessModal(true);
            } else {
              toast.error("Payment verification failed.");
              setIsPaymentLoading(false);
            }
          } catch (err) {
            toast.error("Verification error: " + (err.message || err));
            setIsPaymentLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          contact: phoneValue,
        },
        theme: { color: "#1e3a8a" },
      };

      const rzp = new window.Razorpay(options);
      setIsPaymentLoading(false);
      rzp.on("payment.failed", function (response) {
        toast.error("Payment failed. " + (response.error?.description || ""));
        setIsPaymentLoading(false);
      });
      rzp.open();
    } catch (error) {
      toast.error(error.message || "Payment init failed");
      setIsPaymentLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const verifiedId = routeState.verifiedIdentifier || savedCartLookup.lookupValue;
    const sellingTotal = getCartTotal();

    if (appliedReward && appliedReward.id) {
      const result = await validateReward(appliedReward.id, verifiedId, sellingTotal);
      if (!result.valid) {
        setValidationError(result.reason || 'Applied reward is no longer valid');
        return;
      }
    }
    if (appliedCoupon && appliedCoupon.code) {
      const result = await validateCoupon(appliedCoupon.code, verifiedId, sellingTotal);
      if (!result.valid) {
        setValidationError(result.reason || 'Applied coupon is no longer valid');
        return;
      }
    }

    const dataForMsg = { ...formData, phone: phoneValue };

    setCookie("userDetails", dataForMsg, 30);
    setIsFormSubmitting(true);

    setTimeout(() => {
      const message = formatCartMessage(cartItems, packItems, dataForMsg, appliedReward, appliedCoupon, checkoutSummary.finalTotal);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/919985944466?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");

      clearCart();
      toast.success("Order placed successfully!", { position: "bottom-center", autoClose: 12000 });
      setIsFormSubmitting(false);
      navigate("/");
    }, 1500);
  };

  const { totalItems, totalMRP, sellingTotal, totalDiscount, deliveryCharge: dcCharge, extraDiscount, freeShippingApplied, finalTotal } = checkoutSummary;

  const isMobile = breakpoint === "mobile";

  const containerStyle = {
    maxWidth: isMobile ? "720px" : "1100px",
    margin: "0 auto",
    padding: isMobile ? "24px 16px" : "32px 32px",
  };

  const renderValidationError = () => (
    <div
      style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="card animate-scale-in" style={{
        padding: "40px 32px", maxWidth: "420px", width: "90%", textAlign: "center",
      }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
          boxShadow: "0 4px 20px rgba(244,63,94,0.3)",
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h2 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
          Discount No Longer Available
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>
          {validationError}
        </p>
        <button
          onClick={() => {
            localStorage.removeItem('cart_lookup');
            navigate('/cart', { state: { clearApplied: true } });
          }}
          className="btn-primary"
          style={{ padding: "12px 32px", fontSize: "15px" }}
        >
          Go to Cart
        </button>
      </div>
    </div>
  );

  const renderSuccessModal = () => (
    <div
      style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={() => { setShowSuccessModal(false); navigate("/"); }}
    >
      <div onClick={(e) => e.stopPropagation()} className="card animate-scale-in" style={{
        padding: "40px 32px", maxWidth: "420px", width: "90%", textAlign: "center",
      }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
          boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "26px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
          Payment Successful!
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>
          Thank you for your order
        </p>
        <div className="card" style={{
          padding: "20px", marginBottom: "20px",
          background: "rgba(255,251,235,0.7)",
          border: "1px solid rgba(245,158,11,0.2)",
        }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "var(--accent-dark)", marginBottom: "8px", fontWeight: 500 }}>🎉 You earned</p>
          <p style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "40px", fontWeight: 800, color: "var(--accent)", margin: "0 0 4px 0", lineHeight: 1 }}>{successData.points}</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "var(--accent-dark)", fontWeight: 600, margin: 0 }}>HyperBite Points</p>
        </div>
        {successData.email && (
          <div className="card" style={{
            padding: "12px 16px", marginBottom: "24px",
            background: "rgba(248,250,252,0.7)",
          }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "var(--text-secondary)", margin: "0 0 4px 0" }}>Track your points with</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "var(--text-primary)", fontWeight: 600, margin: 0, wordBreak: "break-all" }}>{successData.email}</p>
          </div>
        )}
        <button
          onClick={() => { setShowSuccessModal(false); navigate("/"); }}
          className="btn-primary"
          style={{ width: "100%", padding: "14px", fontSize: "16px" }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );

  const renderOrderSummaryHeader = () => (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: isMobile ? "14px 16px" : "16px 20px", gap: 12,
      cursor: "pointer",
      transition: "background 0.2s",
    }}
      onClick={() => setOrderExpanded(o => !o)}
      onMouseEnter={(e) => { if (!orderExpanded) e.currentTarget.style.background = "#fafafa"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18" /><path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: isMobile ? "13px" : "14px", fontWeight: 600, color: "#111827", fontFamily: "'Inter', sans-serif" }}>
            Order Summary
          </p>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6B7280", fontFamily: "'Inter', sans-serif" }}>
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: 700, color: "#111827", fontFamily: "'Nunito Sans', sans-serif" }}>
          ₹{finalTotal.toFixed(2)}
        </span>
        {orderExpanded ? <FaChevronUp size={14} color="#9CA3AF" /> : <FaChevronDown size={14} color="#9CA3AF" />}
      </div>
    </div>
  );

  const renderOrderSummaryBody = () => (
    <div>
      <div style={{ padding: isMobile ? "8px 16px" : "8px 20px", maxHeight: isMobile ? "240px" : "280px", overflowY: "auto" }}>
        {cartItems.map((item, idx) => (
          <div key={idx} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 0", fontFamily: "'Inter', sans-serif",
            fontSize: isMobile ? "12px" : "13px", borderBottom: "1px solid #f3f4f6",
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
              <div style={{ width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, borderRadius: 6, backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                <img src={item.image || item.images?.[0] || "/assets/CustomizePack.jpeg"} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ color: "#374151", fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name || `Item ${idx + 1}`}</span>
            </div>
            <span style={{ color: "#6B7280", whiteSpace: 'nowrap', marginLeft: 8 }}>x{item.quantity}</span>
          </div>
        ))}
        {packItems.map((pack, idx) => (
          <div key={`pack-${idx}`} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 0", fontFamily: "'Inter', sans-serif",
            fontSize: isMobile ? "12px" : "13px", borderBottom: "1px solid #f3f4f6",
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
              <div style={{ width: isMobile ? 28 : 32, height: isMobile ? 28 : 32, borderRadius: 6, backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                <img src="/assets/CustomizePack.jpeg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ color: "#374151", fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pack.packName}</span>
            </div>
            <span style={{ color: "#6B7280", whiteSpace: 'nowrap', marginLeft: 8 }}>x{pack.quantity}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: isMobile ? "10px 16px" : "12px 20px", borderTop: "1px solid #f3f4f6", backgroundColor: "#FAFAFA" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", fontFamily: "'Inter', sans-serif", fontSize: isMobile ? "12px" : "13px" }}>
          <span style={{ color: "#6B7280" }}>Total MRP</span>
          <span style={{ color: "#6B7280" }}>₹{totalMRP.toFixed(2)}</span>
        </div>
        {totalDiscount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", fontFamily: "'Inter', sans-serif", fontSize: isMobile ? "12px" : "13px" }}>
            <span style={{ color: "#16A34A" }}>Discount on MRP</span>
            <span style={{ color: "#16A34A", fontWeight: 600 }}>− ₹{totalDiscount.toFixed(2)}</span>
          </div>
        )}
        {extraDiscount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", fontFamily: "'Inter', sans-serif", fontSize: isMobile ? "12px" : "13px" }}>
            <span style={{ color: "#F59E0B" }}>
              {appliedReward ? 'Reward Discount' : 'Coupon Discount'}
              {appliedCoupon && ` (${appliedCoupon.code})`}
            </span>
            <span style={{ color: "#F59E0B", fontWeight: 600 }}>− ₹{extraDiscount.toFixed(2)}</span>
          </div>
        )}
        {(totalDiscount > 0 || extraDiscount > 0 || deliveryCharge > 0) && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderTop: "1px dashed #e5e7eb", marginTop: "4px", fontFamily: "'Inter', sans-serif", fontSize: isMobile ? "12px" : "13px" }}>
            <span style={{ color: "#16A34A", fontWeight: 600 }}>Total Savings</span>
            <span style={{ color: "#16A34A", fontWeight: 700 }}>− ₹{(totalDiscount + extraDiscount + deliveryCharge).toFixed(2)}</span>
          </div>
        )}
        {appliedReward && (
          <div style={{ padding: "6px 8px", marginTop: 4, background: "#FFFBEB", borderRadius: 6, border: "1px solid #FDE68A", fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#92400E", lineHeight: 1.6 }}>
            <div><strong>{appliedReward.label}</strong> {appliedReward.type === 'discount_percent' ? `(${appliedReward.value}% off)` : appliedReward.type === 'discount_fixed' ? `(₹${appliedReward.value} off)` : appliedReward.type === 'free_shipping' ? '(Free Shipping)' : ''}</div>
            {(appliedReward.minCartValue > 0 || appliedReward.maxCartValue > 0) && (
              <div>Cart range: {appliedReward.minCartValue > 0 ? `₹${appliedReward.minCartValue}` : '₹0'} – {appliedReward.maxCartValue > 0 ? `₹${appliedReward.maxCartValue}` : 'No limit'}</div>
            )}
            {appliedReward.expiresAt && <div>Expires: {new Date(appliedReward.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>}
          </div>
        )}
        {appliedCoupon && (
          <div style={{ padding: "6px 8px", marginTop: 4, background: "#FFFBEB", borderRadius: 6, border: "1px solid #FDE68A", fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#92400E", lineHeight: 1.6 }}>
            <div><strong>{appliedCoupon.code}</strong> {appliedCoupon.discount > 0 ? `(${appliedCoupon.discount}% off)` : ''} {appliedCoupon.freeShipping ? '(Free Shipping)' : ''}</div>
          </div>
        )}
        {freeShippingApplied && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", fontFamily: "'Inter', sans-serif", fontSize: isMobile ? "12px" : "13px" }}>
            <span style={{ color: "#16A34A" }}>Free Shipping</span>
            <span style={{ color: "#16A34A", fontWeight: 600 }}>✓ Applied</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", fontFamily: "'Inter', sans-serif", fontSize: isMobile ? "12px" : "13px" }}>
          <span style={{ color: "#6B7280" }}>Delivery</span>
          <span style={{ color: "#16A34A", fontWeight: 600 }}>
            <span style={{ textDecoration: 'line-through', color: '#999', marginRight: 6 }}>₹{dcCharge}</span>
            FREE
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0 0", marginTop: "6px", borderTop: "1px dashed #e5e7eb", fontFamily: "'Nunito Sans', sans-serif" }}>
          <span style={{ fontSize: isMobile ? "15px" : "16px", fontWeight: 700, color: "#111827" }}>Total</span>
          <span style={{ fontSize: isMobile ? "17px" : "18px", fontWeight: 800, color: "#111827" }}>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handlePlaceOrder} className="card" style={{
      padding: isMobile ? "20px" : "28px",
    }}>
      <h2 style={{
        fontFamily: "'Nunito Sans', sans-serif",
        fontSize: isMobile ? "20px" : "22px",
        marginBottom: "24px",
        color: "var(--text-primary)",
        fontWeight: 700,
      }}>
        Delivery Details
      </h2>

      <style>{`
        .custom-phone-input.PhoneInput {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          height: 44px;
        }
        .custom-phone-input .PhoneInputInput {
          width: 100%;
          padding: 0 12px;
          border: none;
          outline: none;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          background: transparent;
          box-sizing: border-box;
          height: 44px;
        }
        .custom-phone-input .PhoneInputCountry {
          padding-left: 12px;
          background: transparent;
        }
        .PhoneInput--focus {
          outline: none;
        }
      `}</style>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "16px", marginBottom: "24px" }}>
        <div style={{ gridColumn: isMobile ? "1" : "1 / -1" }}>
          <label style={{
            fontFamily: "'Inter', sans-serif", fontSize: "13px", marginBottom: "6px",
            color: "var(--text-secondary)", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
            </svg>
            Phone Number <span style={{ color: "var(--error)" }}>*</span>
          </label>
          <div className={`input-field ${formErrors.phone ? 'error' : ''}`} style={{ padding: 0, overflow: "hidden" }}>
            <PhoneInput
              international
              defaultCountry="IN"
              limitMaxLength
              value={phoneValue}
              onChange={(v) => { setPhoneValue(v); if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: "" })); }}
              className="custom-phone-input"
            />
          </div>
          {formErrors.phone && (
            <p style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", fontFamily: "'Inter', sans-serif" }}>{formErrors.phone}</p>
          )}
        </div>

        {[
          { name: "name", label: "Full Name", type: "text", icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" },
          { name: "pincode", label: "Pincode", type: "text", inputMode: "numeric", icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" },
          { name: "city", label: "City / Town", type: "text", icon: "M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" },
          { name: "state", label: "State", type: "text", icon: "M3 21l6-6m0 0l6 6m-6-6V3" },
          { name: "country", label: "Country", type: "text", icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" },
        ].map((field) => (
          <div key={field.name}>
            <label style={{
              fontFamily: "'Inter', sans-serif", fontSize: "13px", marginBottom: "6px",
              color: "var(--text-secondary)", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px",
            }}>
              {field.label} <span style={{ color: "var(--error)" }}>*</span>
              {field.name === "pincode" && pincode && (
                <span className="badge badge-success">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verified
                </span>
              )}
            </label>
            <input
              type={field.type} name={field.name} value={formData[field.name]}
              onChange={(e) => { handleInputChange(e); if (formErrors[field.name]) setFormErrors((prev) => ({ ...prev, [field.name]: "" })); }}
              inputMode={field.inputMode || "text"}
              className={`input-field ${
                formErrors[field.name] || (pincodeError && field.name === "pincode") ? 'error'
                  : pincode && field.name === "pincode" ? 'success' : ''
              }`}
            />
            {formErrors[field.name] && (
              <p style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", fontFamily: "'Inter', sans-serif" }}>{formErrors[field.name]}</p>
            )}
            {pincodeError && field.name === "pincode" && !formErrors[field.name] && (
              <p style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", fontFamily: "'Inter', sans-serif" }}>{pincodeError}</p>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{
          fontFamily: "'Inter', sans-serif", fontSize: "13px", marginBottom: "6px",
          color: "var(--text-secondary)", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Email <span style={{ color: "var(--text-secondary)", fontSize: "11px", fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          type="email" name="email" value={formData.email}
          onChange={(e) => { handleInputChange(e); }}
          placeholder="Enter your email for order updates"
          className="input-field"
        />
      </div>

      <div style={{ marginBottom: "32px" }}>
        <label style={{
          display: "block", fontFamily: "'Inter', sans-serif", fontSize: "13px",
          marginBottom: "6px", color: "var(--text-secondary)", fontWeight: 500,
        }}>
          Full Address / Landmark Details <span style={{ color: "var(--error)" }}>*</span>
        </label>
        <textarea
          name="address" value={formData.address}
          onChange={(e) => { handleInputChange(e); if (formErrors.address) setFormErrors((prev) => ({ ...prev, address: "" })); }}
          placeholder="Enter your complete address with landmark details"
          className={`input-field ${formErrors.address ? 'error' : ''}`}
          style={{ minHeight: "88px", resize: "vertical" }}
        />
        {formErrors.address && (
          <p style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px", fontFamily: "'Inter', sans-serif" }}>{formErrors.address}</p>
        )}
      </div>

      <button
        type="button" disabled={isPaymentLoading} onClick={handlePayNow}
        className="btn-primary"
        style={{
          width: "100%",
          padding: isMobile ? "13px" : "15px",
          fontSize: isMobile ? "14px" : "15px",
        }}
      >
        {isPaymentLoading ? (
          <><div style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} /> Processing...</>
        ) : (
          <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg> Pay Securely</>
        )}
      </button>
    </form>
  );

  return (
    <div className="page-wrap" style={{ paddingTop: "80px" }}>
      {validationError && renderValidationError()}
      {showSuccessModal && renderSuccessModal()}

      <div style={containerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "10px" : "16px", marginBottom: isMobile ? "16px" : "24px" }}>
          <button
            onClick={() => navigate("/cart")}
            style={{
              width: isMobile ? "32px" : "40px", height: isMobile ? "32px" : "40px",
              borderRadius: "50%", border: "1px solid #e5e7eb", background: "#ffffff",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s ease", flexShrink: 0,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f4f6"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div>
            <h1 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: isMobile ? "20px" : "28px", color: "#1f2937", fontWeight: 800, letterSpacing: "-0.025em", margin: 0, lineHeight: 1.2 }}>
              Checkout
            </h1>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? "12px" : "13px", color: "#9ca3af", margin: "2px 0 0 0" }}>
              Complete your order
            </p>
          </div>
        </div>

        {isMobile ? (
          <div>
            <div className="card" style={{
              overflow: "hidden", marginBottom: 16,
              boxShadow: orderExpanded ? "var(--shadow-lg)" : "var(--shadow-md)",
              transition: "box-shadow 0.3s ease",
            }}>
              {renderOrderSummaryHeader()}
              {orderExpanded && renderOrderSummaryBody()}
            </div>
            {renderForm()}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div style={{ flex: "0 0 380px", position: "sticky", top: 104 }}>
              <div className="card" style={{
                overflow: "hidden",
                transition: "box-shadow 0.3s ease",
              }}>
                {renderOrderSummaryHeader()}
                {orderExpanded && renderOrderSummaryBody()}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {renderForm()}
            </div>
          </div>
        )}

        {(isPaymentLoading || isFormSubmitting) && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 9999,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}>
            <div className="card animate-scale-in" style={{
              padding: "40px 36px", textAlign: "center", minWidth: "280px",
            }}>
              <div style={{
                width: "48px", height: "48px",
                border: "3px solid rgba(13,148,136,0.15)",
                borderTop: "3px solid var(--accent)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
              }} />
              <h3 style={{
                fontFamily: "'Nunito Sans', sans-serif", fontSize: "18px",
                color: "var(--text-primary)", marginBottom: "8px", fontWeight: 700,
              }}>
                {isPaymentLoading ? "Securing Payment" : "Verifying Order"}
              </h3>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: "14px",
                color: "var(--text-secondary)", margin: 0,
              }}>
                Please wait a moment...
              </p>
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
