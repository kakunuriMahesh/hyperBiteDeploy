import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import { formatCartMessage } from "../utils/whatsapp";
import { getCookie, setCookie } from "../utils/cookies";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
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
    // Load this pack into progress
    startOrUpdateInProgressPack({
      packId: pack.packId,
      packName: pack.packName,
      packPrice: pack.packPrice,
      packOffPrice: pack.packOffPrice,
      items: pack.items,
      total: pack.total || pack.packPrice, // Best guess if total not saved
    });
    // Remove from cart (to avoid duplication when they add it back)
    removePackFromCart(pack.instanceId);
    // Navigate
    navigate(`/customize-pack/${pack.packId}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: breakpoint === "mobile" ? "column" : "row",
        gap: "20px",
        padding: "20px",
        marginBottom: "20px",
        backgroundColor: "#f0f8ff",
        borderRadius: "12px",
        border: "2px solid #4a90e2",
      }}
    >
      {/* Pack Icon */}
      <div
        style={{
          width: breakpoint === "mobile" ? "100%" : "150px",
          height: "150px",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "48px",
        }}
      >
        <img src="/assets/CustomizePack.jpeg" alt="Customize Pack" />
      </div>

      {/* Pack Info */}
      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontFamily: "'Permanent_Marker-Regular', Helvetica",
            fontSize: breakpoint === "mobile" ? "24px" : "28px",
            marginBottom: "8px",
            color: "#000",
          }}
        >
          {pack.packName}
        </h3>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            color: "#666",
            marginBottom: "8px",
          }}
        >
          {pack.items?.reduce(
            (total, item) => total + (item.quantity || 0),
            0,
          ) || 0}{" "}
          items selected
        </p>
        <p
          style={{
            fontFamily: "'Permanent_Marker-Regular', Helvetica",
            fontSize: breakpoint === "mobile" ? "20px" : "24px",
            color: "#000",
            marginBottom: "12px",
          }}
        >
          ₹{pack.packPrice}
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: "#999",
              textDecoration: "line-through",
              marginLeft: "8px",
            }}
          >
            ₹{pack.packOffPrice}
          </span>
        </p>

        {/* Buttons Row */}
        {pack.packPrice !== 250 && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                background: "none",
                border: "none",
                color: "#4a90e2",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "14px",
              }}
            >
              {showDetails ? "Hide Items" : "View Items"}
            </button>
            <button
              onClick={handleEdit}
              style={{
                background: "#4a90e2",
                border: "none",
                color: "#fff",
                borderRadius: "4px",
                padding: "4px 12px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Edit Pack
            </button>
          </div>
        )}

        {showDetails && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "8px",
            }}
          >
            {pack.items &&
              pack.items.map((item, i) => {
                const pDetails = productDetails[item.id];
                return (
                  <div
                    key={i}
                    style={{ fontSize: "14px", marginBottom: "4px" }}
                  >
                    <strong>{pDetails?.name || item.id}</strong>:{" "}
                    {item.quantity} units
                  </div>
                );
              })}
          </div>
        )}

        {/* Quantity Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button
            onClick={() =>
              updatePackQuantity(
                pack.instanceId || pack.packId,
                pack.quantity - 1,
              )
            }
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#000",
            }}
          >
            <FaMinus size={14} />
          </button>
          <span
            style={{
              fontFamily: "'Permanent_Marker-Regular', Helvetica",
              fontSize: "20px",
              minWidth: "40px",
              textAlign: "center",
            }}
          >
            {pack.quantity}
          </span>
          <button
            onClick={() =>
              updatePackQuantity(
                pack.instanceId || pack.packId,
                pack.quantity + 1,
              )
            }
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#000",
            }}
          >
            <FaPlus size={14} />
          </button>
          <button
            onClick={() => removePackFromCart(pack.instanceId || pack.packId)}
            style={{
              marginLeft: "auto",
              padding: "8px 16px",
              backgroundColor: "#ff4444",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
              fontSize: "16px",
            }}
          >
            <FaTrash size={14} />
            Remove
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
    pincode: "",
    country: "",
    landmark: "",
  });
  const [pincodeError, setPincodeError] = useState("");
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

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

  // Load saved user details from cookies
  useEffect(() => {
    const savedDetails = getCookie("userDetails");
    if (savedDetails) {
      setFormData(savedDetails);
    }
    // Pre-fill pincode if already verified in context
    if (pincode) {
      setFormData((prev) => ({
        ...prev,
        pincode: pincode,
      }));
    }
  }, [pincode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear pincode error when user starts typing
    if (name === "pincode") {
      setPincodeError("");
    }
  };

  const handlePayNow = () => {
    // Validate pincode before showing payment form
    if (!formData.pincode.trim()) {
      setPincodeError("Please enter a pincode");
      return;
    }
    // Start Razorpay checkout flow
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

      // Prepare items for server calculation
      const items = [];
      cartItems.forEach((it) => {
        items.push({ id: it.id, name: it.name, price: Number(it.price) || 0, quantity: it.quantity || 1 });
      });
      packItems.forEach((p) => {
        items.push({ id: p.packId || p.instanceId, name: p.packName, price: Number(p.packPrice) || 0, quantity: p.quantity || 1 });
      });

      // const resp = await fetch("http://localhost:5000/api/payment/create-order", {
      const resp = await fetch("https://hyperbitefullstack.onrender.com/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.landmark || ""} ${formData.pincode || ""}`,
          city: formData.country || "",
          pincode: formData.pincode || "",
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
            // const verifyRes = await fetch("http://localhost:5000/api/payment/verify", {
            const verifyRes = await fetch("https://hyperbitefullstack.onrender.com/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });

            const verifyJson = await verifyRes.json();
            if (verifyRes.ok && verifyJson.success) {
              toast.success("Payment successful and verified.", { position: "bottom-center" });
              clearCart();
              navigate("/");
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err) {
            toast.error("Verification error: " + (err.message || err));
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#4a90e2" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error("Payment failed. " + (response.error && response.error.description ? response.error.description : ""));
      });
      rzp.open();
    } catch (error) {
      toast.error(error.message || "Payment init failed");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Validate pincode
    if (!formData.pincode.trim()) {
      setPincodeError("Please enter a pincode");
      return;
    }

    //FIXME: Pincode validation check - commented out to allow any pincode
    // if (!allowedPincodes.includes(formData.pincode)) {
    //   setPincodeError("Currently we are not delivering in your location");
    //   return;
    // }

    // Save user details to cookies (30 days)
    setCookie("userDetails", formData, 30);

    // Format and send WhatsApp message
    const message = formatCartMessage(cartItems, packItems, formData);
    const encodedMessage = encodeURIComponent(message);
    //FIXME: Updated WhatsApp number to '+91 99859 44466'
    const whatsappUrl = `https://wa.me/919985944466?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");

    // Clear cart after order
    clearCart();

    // Show success message
    toast.success("Order placed successfully!.", {
      position: "bottom-center",
      autoClose: 12000,
    });

    // Navigate to home
    navigate("/");
  };

  if (
    cartItems.length === 0 &&
    packItems.length === 0 &&
    inProgressPacks.length === 0
  ) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          minHeight: "100vh",
          paddingTop: "70px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: breakpoint === "mobile" ? "40px 20px" : "60px 40px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "85vh",
          }}
        >
          <h1
            style={{
              fontFamily: "Nunito Sans",
              fontSize: breakpoint === "mobile" ? "28px" : "36px",
              marginBottom: "18px",
              color: "#111",
              fontWeight: 700,
            }}
          >
            Your Cart is Empty
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: breakpoint === "mobile" ? "14px" : "16px",
              marginBottom: "30px",
              color: "#666",
            }}
          >
            Add some products to your cart to get started!
          </p>
          <button
            onClick={() => navigate("/products")}
            style={{
              padding: breakpoint === "mobile" ? "14px 28px" : "16px 32px",
              fontFamily: "'Inter', sans-serif",
              fontSize: breakpoint === "mobile" ? "14px" : "16px",
              backgroundColor: "#000",
              color: "#fff",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.6px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#333";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#000";
              e.target.style.transform = "scale(1)";
            }}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        minHeight: "100vh",
        paddingTop: "70px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: breakpoint === "mobile" ? "10px auto" : "100px auto",
          padding: breakpoint === "mobile" ? "20px" : "40px",
        }}
      >
        <h1
          style={{
            fontFamily: "Nunito Sans",
            fontSize: breakpoint === "mobile" ? "28px" : "36px",
            marginBottom: "24px",
            color: "#111",
            fontWeight: 700,
          }}
        >
          Your Cart
        </h1>

        {/* Cart Items */}
        <div style={{ marginBottom: "40px" }}>
          {/* Regular Products */}
          {cartItems.map((item, index) => (
            <div
              key={`${item.id}-${item.variation || "default"}-${index}`}
              style={{
                display: "flex",
                flexDirection: breakpoint === "mobile" ? "column" : "row",
                gap: "20px",
                padding: "20px",
                marginBottom: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "12px",
                border: "1px solid #eee",
              }}
            >
              {/* Product Image */}
              <div
                style={{
                  width: breakpoint === "mobile" ? "100%" : "150px",
                  height: "150px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={item.image || item.images?.[0]}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    padding: "8px",
                  }}
                />
              </div>

              {/* Product Info */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontFamily: "'Permanent_Marker-Regular', Helvetica",
                    fontSize: breakpoint === "mobile" ? "24px" : "28px",
                    marginBottom: "8px",
                    color: "#000",
                  }}
                >
                  {item.name}
                </h3>
                {item.variation && item.variation !== "default" && (
                  <p
                    style={{
                      fontFamily:
                        "'Just_Me_Again_Down_Here-Regular', Helvetica",
                      fontSize: "16px",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    Variation: {item.variation}
                  </p>
                )}
                <p
                  style={{
                    fontFamily: "'Permanent_Marker-Regular', Helvetica",
                    fontSize: breakpoint === "mobile" ? "20px" : "24px",
                    color: "#000",
                    marginBottom: "12px",
                  }}
                >
                  {item.price}
                </p>

                {/* Quantity Controls */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.variation || "default",
                        item.quantity - 1,
                      )
                    }
                    style={{
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: "#000",
                    }}
                  >
                    <FaMinus size={14} />
                  </button>
                  <span
                    style={{
                      fontFamily: "'Permanent_Marker-Regular', Helvetica",
                      fontSize: "20px",
                      minWidth: "40px",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.variation || "default",
                        item.quantity + 1,
                      )
                    }
                    style={{
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      cursor: "pointer",
                      color: "#000",
                    }}
                  >
                    <FaPlus size={14} />
                  </button>
                  <button
                    onClick={() =>
                      removeFromCart(item.id, item.variation || "default")
                    }
                    style={{
                      marginLeft: "auto",
                      padding: "8px 16px",
                      backgroundColor: "#ff4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontFamily:
                        "'Just_Me_Again_Down_Here-Regular', Helvetica",
                      fontSize: "16px",
                    }}
                  >
                    <FaTrash size={14} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pack Items */}
          {/* In-Progress Packs */}
          {inProgressPacks.map((pack, idx) => {
            const min = pack.packPrice || pack.total || 0;
            const progress =
              min > 0 ? Math.min((pack.total / min) * 100, 100) : 0;
            return (
              <div
                key={`inprogress-${pack.packId}-${idx}`}
                style={{
                  display: "flex",
                  flexDirection: breakpoint === "mobile" ? "column" : "row",
                  gap: "20px",
                  padding: "20px",
                  marginBottom: "20px",
                  backgroundColor: "#fff8e1",
                  borderRadius: "12px",
                  border: "2px dashed #ffb300",
                }}
              >
                <div
                  style={{
                    width: breakpoint === "mobile" ? "100%" : "150px",
                    height: "150px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "48px",
                  }}
                >
                  <img src="/assets/CustomizePack.jpeg" alt="CustomizePack" />
                </div>

                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "'Permanent_Marker-Regular', Helvetica",
                      fontSize: breakpoint === "mobile" ? "22px" : "26px",
                      marginBottom: "8px",
                      color: "#000",
                    }}
                  >
                    {pack.packName}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "8px",
                    }}
                  >
                    {pack.items?.reduce(
                      (total, item) => total + (item.quantity || 0),
                      0,
                    ) || 0}{" "}
                    items selected
                  </p>

                  <div style={{ margin: "12px 0" }}>
                    <div
                      style={{
                        height: "8px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "8px",
                          width: `${progress}%`,
                          backgroundColor:
                            progress >= 100 ? "#4caf50" : "#ff9800",
                        }}
                      />
                    </div>
                    <div style={{ marginTop: 8, fontWeight: 700 }}>
                      ₹
                      {(pack.total || 0).toFixed
                        ? pack.total.toFixed(2)
                        : pack.total}{" "}
                      / ₹{min}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    {pack.total < min ? (
                      <p style={{ color: "#ff5722", fontWeight: 600 }}>
                        Add ₹{(min - (pack.total || 0)).toFixed(2)} more to
                        &nbsp;
                        <Link
                          style={{
                            color: "#ff5722",
                            textDecoration: "underline",
                          }}
                          to="/customize-pack/pack500"
                        >
                          order this pack.
                        </Link>
                      </p>
                    ) : (
                      <button
                        onClick={() => finalizeInProgressPack(pack.packId)}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#000",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                        }}
                      >
                        Order Now
                      </button>
                    )}

                    <button
                      onClick={() => removeInProgressPack(pack.packId)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#ff4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                      }}
                    >
                      Discard
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

        {/* Order Summary */}
        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "30px",
            borderRadius: "12px",
            marginBottom: "30px",
            border: "1px solid #eee",
          }}
        >
          <h2
            style={{
              fontFamily: "Nunito Sans",
              fontSize: breakpoint === "mobile" ? "20px" : "22px",
              marginBottom: "16px",
              color: "#111",
              fontWeight: 600,
            }}
          >
            Order Summary
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 0",
              borderTop: "1px solid #ddd",
              borderBottom: "1px solid #ddd",
              marginTop: "20px",
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: breakpoint === "mobile" ? "16px" : "18px",
                color: "#666",
                fontWeight: 600,
              }}
            >
              Total:
            </span>
            <span
              style={{
                fontFamily: "Nunito Sans",
                fontSize: breakpoint === "mobile" ? "18px" : "22px",
                color: "#111",
                fontWeight: 700,
              }}
            >
              {getCartTotal().toFixed(2)} RS
            </span>
          </div>
        </div>

        {/* Place Order Button */}
        {!showForm && (
          <div style={{ display: "flex", gap: "12px", flexDirection: breakpoint === "mobile" ? "column" : "row" }}>
            <button
              onClick={() => setShowForm(true)}
              style={{
                flex: 1,
                padding: breakpoint === "mobile" ? "14px" : "18px",
                fontFamily: "'Inter', sans-serif",
                fontSize: breakpoint === "mobile" ? "14px" : "16px",
                backgroundColor: "#25D366",
                color: "#fff",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#20BA5A";
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#25D366";
                e.target.style.transform = "scale(1)";
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ marginRight: "8px" }}
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Place Order
            </button>
            <button
              onClick={handlePayNow}
              disabled={isPaymentLoading}
              style={{
                flex: 1,
                padding: breakpoint === "mobile" ? "14px" : "18px",
                fontFamily: "'Inter', sans-serif",
                fontSize: breakpoint === "mobile" ? "14px" : "16px",
                backgroundColor: isPaymentLoading ? "#cccccc" : "#4a90e2",
                color: "#fff",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                border: "none",
                borderRadius: "8px",
                cursor: isPaymentLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
              onMouseEnter={(e) => {
                if (!isPaymentLoading) {
                  e.target.style.backgroundColor = "#3a7bc8";
                  e.target.style.transform = "scale(1.02)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isPaymentLoading) {
                  e.target.style.backgroundColor = "#4a90e2";
                  e.target.style.transform = "scale(1)";
                }
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ marginRight: "8px" }}
              >
                <path d="M20 8H4V6h16m0 10v-2H4v2m0 4h16v-2H4m15-7H9v5h6V9z"/>
              </svg>
              {isPaymentLoading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        )}

        {/* Order Form */}
        {showForm && (
          <form
            onSubmit={handlePlaceOrder}
            style={{
              backgroundColor: "#f9f9f9",
              padding: "30px",
              borderRadius: "12px",
              marginTop: "30px",
              border: "1px solid #eee",
            }}
          >
            <h2
              style={{
                fontFamily: "Nunito Sans",
                fontSize: breakpoint === "mobile" ? "20px" : "22px",
                marginBottom: "18px",
                color: "#111",
                fontWeight: 600,
              }}
            >
              Delivery Information
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  breakpoint === "mobile" ? "1fr" : "repeat(2, 1fr)",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    marginBottom: "8px",
                    color: "#333",
                    fontWeight: 600,
                  }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    marginBottom: "8px",
                    color: "#333",
                    fontWeight: 600,
                  }}
                >
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    marginBottom: "8px",
                    color: "#333",
                    fontWeight: 600,
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    marginBottom: "8px",
                    color: "#333",
                    fontWeight: 600,
                  }}
                >
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    marginBottom: "8px",
                    color: "#333",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Pincode *
                  {pincode && (
                    <span
                      style={{
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      ✓ Verified
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: pincodeError
                      ? "2px solid #ff4444"
                      : pincode
                        ? "2px solid #4caf50"
                        : "1px solid #ddd",
                    borderRadius: "8px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    backgroundColor: pincodeError
                      ? "#fff5f5"
                      : pincode
                        ? "#e8f5e9"
                        : "#fff",
                  }}
                />
                {pincodeError && (
                  <p
                    style={{
                      color: "#ff4444",
                      fontSize: "12px",
                      marginTop: "6px",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {pincodeError}
                  </p>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
                    fontSize: "18px",
                    marginBottom: "8px",
                    color: "#333",
                  }}
                >
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
                    fontSize: "16px",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  marginBottom: "8px",
                  color: "#333",
                  fontWeight: 600,
                }}
              >
                Landmark *
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: breakpoint === "mobile" ? "14px" : "18px",
                fontFamily: "'Inter', sans-serif",
                fontSize: breakpoint === "mobile" ? "14px" : "16px",
                backgroundColor: "#25D366",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#20BA5A";
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#25D366";
                e.target.style.transform = "scale(1)";
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Place Order via WhatsApp
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Cart;
