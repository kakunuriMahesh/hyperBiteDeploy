import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { formatCartMessage } from "../utils/whatsapp";
import { getCookie, setCookie } from "../utils/cookies";
import { FaTrash, FaPlus, FaMinus, FaEdit, FaChevronDown, FaChevronUp, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { allowedPincodes } from "../config/allowedPincodes";
import { productDetails } from "../config/productDetails";

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
    pincode,
    finalizeInProgressPack,
    removeInProgressPack,
    validateAndSetPincode,
    removeFromCart,
    updateQuantity,
    removePackFromCart,
    updatePackQuantity,
    getCartTotal,
    clearCart,
  } = useCart();
  const [breakpoint, setBreakpoint] = useState("desktop");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    whatsapp: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });
  const [pincodeError, setPincodeError] = useState("");
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({ points: 0, email: '' });

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

  useEffect(() => {
    const savedDetails = getCookie("userDetails");
    if (savedDetails) {
      setFormData(savedDetails);
    }
    if (pincode) {
      setFormData((prev) => ({ ...prev, pincode }));
    }
  }, [pincode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "pincode") setPincodeError("");
  };

  const handlePayNow = () => {
    if (!formData.pincode.trim()) {
      setPincodeError("Please enter a pincode");
      return;
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

  const initiateRazorpay = async () => {
    if (!formData.pincode.trim()) {
      setPincodeError("Please enter a pincode");
      return;
    }

    try {
      setIsPaymentLoading(true);

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
        // Build sub-items array with product names from productDetails
        const subItems = (p.items || []).map((sub) => {
          const detail = productDetails[sub.id];
          return {
            id: sub.id,
            name: detail?.name || sub.id,
            quantity: sub.quantity || 1,
          };
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

      // const resp = await fetch("https://hyperbitedeploy.onrender.com/api/payment/create-order", {
      const resp = await fetch("http://localhost:5000/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            whatsapp: formData.whatsapp,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pincode: formData.pincode,
          },
          items,
        }),
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
            // const verifyRes = await fetch("https://hyperbitedeploy.onrender.com/api/payment/verify", {
            const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
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
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#1e3a8a" }, // Premium blue
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

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!formData.pincode.trim()) {
      setPincodeError("Please enter a pincode");
      return;
    }

    // FIXME: Pincode validation commented out
    // if (!allowedPincodes.includes(formData.pincode)) {
    //   setPincodeError("Currently we are not delivering in your location");
    //   return;
    // }

    setCookie("userDetails", formData, 30);
    setIsFormSubmitting(true);

    setTimeout(() => {
      const message = formatCartMessage(cartItems, packItems, formData);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/919985944466?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");

      clearCart();
      toast.success("Order placed successfully!", { position: "bottom-center", autoClose: 12000 });
      setIsFormSubmitting(false);
      navigate("/");
    }, 1500);
  };

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
          const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
            + packItems.reduce((sum, pack) => sum + pack.quantity, 0);

          // Calculate MRP: for packs use offPrice if available, otherwise packPrice; for items use price
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
          const deliveryCharge = 0; // Free delivery

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
                <div style={{ ...summaryRowStyle, borderBottom: "1px dashed #e5e7eb", paddingBottom: "12px" }}>
                  <span style={{ color: "#4b5563" }}>Delivery Charges</span>
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>FREE</span>
                </div>

                {/* Grand Total */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 0 4px 0",
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
                    ₹{sellingTotal.toFixed(2)}
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

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
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
        )}

        {showForm && (
          <form
            onSubmit={handlePlaceOrder}
            style={{
              backgroundColor: "#ffffff",
              padding: breakpoint === "mobile" ? "16px" : "24px",
              borderRadius: "12px",
              marginTop: "16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h2
              style={{
                fontFamily: "'Nunito Sans', sans-serif",
                fontSize: breakpoint === "mobile" ? "20px" : "22px",
                marginBottom: "24px",
                color: "#1f2937",
                fontWeight: 700,
              }}
            >
              Delivery Details
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: breakpoint === "mobile" ? "1fr" : "repeat(2, 1fr)",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {[
                { name: "name", label: "Full Name", type: "text", required: true },
                { name: "phone", label: "Phone Number", type: "tel", required: true },
                { name: "email", label: "Email Address", type: "email", required: true },
                { name: "whatsapp", label: "WhatsApp Number", type: "tel", required: true },
                { name: "pincode", label: "Pincode", type: "text", required: true },
                { name: "city", label: "City / Town", type: "text", required: true },
                { name: "state", label: "State", type: "text", required: true },
                { name: "country", label: "Country", type: "text", required: true },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "13px",
                      marginBottom: "6px",
                      color: "#4b5563",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {field.label} {field.required && <span style={{ color: "#ef4444" }}>*</span>}
                    {field.name === "pincode" && pincode && (
                      <span
                        style={{
                          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                          color: "#fff",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: 500,
                        }}
                      >
                        Verified
                      </span>
                    )}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    required={field.required}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      border: pincodeError && field.name === "pincode"
                        ? "1px solid #ef4444"
                        : pincode && field.name === "pincode"
                          ? "1px solid #22c55e"
                          : "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      backgroundColor: "#fff",
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = pincodeError && field.name === "pincode"
                        ? "#ef4444"
                        : pincode && field.name === "pincode"
                          ? "#22c55e"
                          : "#d1d5db";
                    }}
                  />
                  {pincodeError && field.name === "pincode" && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "4px",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {pincodeError}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  marginBottom: "6px",
                  color: "#4b5563",
                  fontWeight: 500,
                }}
              >
                Full Address / Landmark Details <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="Enter your complete address with landmark details"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                  minHeight: "80px",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db";
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: breakpoint === "mobile" ? "1fr" : "repeat(2, 1fr)", gap: "12px", marginBottom: "12px" }}>
              <button
                type="button"
                disabled={isFormSubmitting}
                onClick={handlePlaceOrder}
                style={{
                  padding: "12px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  background: isFormSubmitting
                    ? "#9ca3af"
                    : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isFormSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(34,197,94,0.2)",
                }}
                onMouseEnter={(e) => {
                  if (!isFormSubmitting) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(34,197,94,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isFormSubmitting) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(34,197,94,0.2)";
                  }
                }}
              >
                {isFormSubmitting ? (
                  <>
                    <div style={{ width: "16px", height: "16px", border: "2px solid #fff", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Place via WhatsApp
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isPaymentLoading}
                onClick={handlePayNow}
                style={{
                  padding: "12px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  background: isPaymentLoading
                    ? "#9ca3af"
                    : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isPaymentLoading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(59,130,246,0.2)",
                }}
                onMouseEnter={(e) => {
                  if (!isPaymentLoading) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(59,130,246,0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isPaymentLoading) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(59,130,246,0.2)";
                  }
                }}
              >
                {isPaymentLoading ? (
                  <>
                    <div style={{ width: "16px", height: "16px", border: "2px solid #fff", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 5h18M3 19h18M3 12h18" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Pay Securely
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                width: "100%",
                padding: "10px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                backgroundColor: "#f3f4f6",
                color: "#4b5563",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#e5e7eb";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f3f4f6";
              }}
            >
              Back to Cart
            </button>
          </form>
        )}

        {(isPaymentLoading || isFormSubmitting) && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "32px",
                borderRadius: "16px",
                textAlign: "center",
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                minWidth: "280px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  border: "3px solid #f3f4f6",
                  borderTop: "3px solid #3b82f6",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 16px",
                }}
              />
              <h3
                style={{
                  fontFamily: "'Nunito Sans', sans-serif",
                  fontSize: "18px",
                  color: "#1f2937",
                  marginBottom: "8px",
                  fontWeight: 700,
                }}
              >
                {isPaymentLoading ? "Securing Payment" : "Verifying Order"}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                Please wait a moment...
              </p>
            </div>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;