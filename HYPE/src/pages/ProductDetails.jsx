import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productDetails } from "../config/productDetails";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { formatProductMessage, sendWhatsAppMessage } from "../utils/whatsapp";
import { FaWhatsapp, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import { allowedPincodes } from "../config/allowedPincodes";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, setPincode } = useCart();
  const [breakpoint, setBreakpoint] = useState("desktop");
  const [product, setProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [pincode, setPincodeLocal] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [pincodeVerified, setPincodeVerified] = useState(false);

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
    if (productId && productDetails[productId]) {
      setProduct(productDetails[productId]);
    } else {
      navigate("/");
    }
  }, [productId, navigate]);

  useEffect(() => {
    const getPincode = localStorage.getItem("pincode");
    if (getPincode) {
      setPincodeLocal(getPincode);
      setPincodeVerified(true);
    }
  }, []);

  if (!product) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  const images = product?.images || (product?.image ? [product.image] : []);

  // Related products/variations based on product type
  const getRelatedProducts = () => {
    const baseVariations = {
      nuts: [
        {
          id: "nuts-salted",
          name: "Salted Nuts Mix",
          description: "Premium mixed nuts with a perfect touch of salt.",
          price: "65 RS",
          image: "/assets/wallnut.webp",
          badge: "Salted",
        },
        {
          id: "nuts-unsalted",
          name: "Unsalted Nuts Mix",
          description: "Pure natural nuts without any added salt.",
          price: "60 RS",
          image: "/assets/pumpkinseed.webp",
          badge: "Unsalted",
        },
        {
          id: "nuts-pack8",
          name: "Nuts Mix - Pack of 8",
          description: "Get 8 packs and save more! Perfect for families.",
          price: "450 RS",
          image: "/assets/sunflowerseed.webp",
          badge: "Pack of 8",
        },
        {
          id: "nuts-honey",
          name: "Honey Roasted Nuts",
          description: "Sweet and crunchy honey roasted nuts mix.",
          price: "70 RS",
          image: "/assets/dateorange.webp",
          badge: "Honey",
        },
      ],
      dates: [
        {
          id: "dates-ajwa",
          name: "Ajwa Dates",
          description: "Premium Ajwa dates, known for their soft texture.",
          price: "80 RS",
          image: "/assets/date.webp",
          badge: "Ajwa",
        },
        {
          id: "dates-khalas",
          name: "Khalas Dates",
          description: "Sweet and tender Khalas dates.",
          price: "65 RS",
          image: "/assets/dateorange.webp",
          badge: "Khalas",
        },
        {
          id: "dates-pack8",
          name: "Dates - Pack of 8",
          description: "Get 8 packs of premium dates and save!",
          price: "480 RS",
          image: "/assets/date.webp",
          badge: "Pack of 8",
        },
        {
          id: "dates-medjool",
          name: "Medjool Dates",
          description: "Large and luscious Medjool dates.",
          price: "90 RS",
          image: "/assets/date.webp",
          badge: "Medjool",
        },
      ],
      seeds: [
        {
          id: "seeds-sunflower",
          name: "Sunflower Seeds",
          description: "Premium roasted sunflower seeds.",
          price: "45 RS",
          image: "/assets/sunflowerseed.webp",
          badge: "Sunflower",
        },
        {
          id: "seeds-pumpkin",
          name: "Pumpkin Seeds",
          description: "Crunchy and nutritious pumpkin seeds.",
          price: "50 RS",
          image: "/assets/pumpkinseed.webp",
          badge: "Pumpkin",
        },
        {
          id: "seeds-pack8",
          name: "Seeds Mix - Pack of 8",
          description: "Mixed seeds collection in pack of 8.",
          price: "360 RS",
          image: "/assets/sunflowershell.webp",
          badge: "Pack of 8",
        },
        {
          id: "seeds-mixed",
          name: "Mixed Seeds",
          description: "Variety pack with all seed types.",
          price: "60 RS",
          image: "/assets/sunflowerseed.webp",
          badge: "Mixed",
        },
      ],
    };

    return baseVariations[productId] || [];
  };

  const handleProductSelect = (variation) => {
    const updatedProduct = {
      ...product,
      name: variation.name,
      description: variation.description,
      price: variation.price,
      image: variation.image,
      images: [variation.image, ...(product.images || []).slice(1)],
    };
    setProduct(updatedProduct);
    setSelectedImageIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleVerifyPincode = () => {
    if (!pincode.trim()) {
      setPincodeError("Please enter a pincode");
      return;
    }

    if (!allowedPincodes.includes(pincode)) {
      setPincodeError("Currently we are not delivering in your location");
      setPincodeLocal("");
      return;
    }

    setPincodeError("");
    setPincodeVerified(true);
    setPincode(pincode); // Store in context
    toast.success("Pincode verified!");
  };

  const handlePincodeInputChange = (e) => {
    setPincodeLocal(e.target.value);
    setPincodeError("");
    setPincodeVerified(false); // ← Hide badge immediately when typing
  };

  const relatedProducts = getRelatedProducts();

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh", paddingTop: "70px" }}>
      {/* <Navbar /> */}

      {/* Main Content */}
      <div
        style={{
          maxWidth: breakpoint === "desktop" ? "1200px" : "100%",
          margin: breakpoint === "mobile" ? "50px auto" : "100px auto",
          padding: breakpoint === "mobile" ? "20px" : "40px",
        }}
      >
        {/* Product Header Section */}
        <div
          style={{
            display: "flex",
            flexDirection: breakpoint === "mobile" ? "column" : "row",
            gap: breakpoint === "mobile" ? "30px" : "60px",
            marginBottom: "60px",
          }}
        >
          {/* Product Image Gallery */}
          <div
            style={{
              flex: breakpoint === "mobile" ? "1" : "0 0 400px",
            }}
          >
            {/* Main Image */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src={images[selectedImageIndex] || product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  height: breakpoint === "mobile" ? "auto" : "400px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  border: "1px solid #eee",
                }}
              />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    style={{
                      padding: 0,
                      border: selectedImageIndex === index ? "2px solid #000" : "2px solid #ddd",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background: "transparent",
                      overflow: "hidden",
                      width: breakpoint === "mobile" ? "60px" : "80px",
                      height: breakpoint === "mobile" ? "60px" : "80px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div style={{ flex: "1" }}>
            <h1
              style={{
                fontFamily: "Nunito Sans",
                fontSize: breakpoint === "mobile" ? "28px" : breakpoint === "tablet" ? "36px" : "44px",
                marginBottom: "12px",
                color: "#111",
                fontWeight: 700,
                letterSpacing: "-0.4px",
              }}
            >
              {product.name}
            </h1>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: breakpoint === "mobile" ? "14px" : "16px",
                lineHeight: "1.6",
                marginBottom: "20px",
                color: "#333",
              }}
            >
              {product.description}
            </p>

            <div style={{ marginBottom: "32px" }}>
              <span
                style={{
                  fontFamily: "Nunito Sans",
                  fontSize: breakpoint === "mobile" ? "20px" : "28px",
                  color: "#111",
                  fontWeight: 700,
                }}
              >
                {product.price}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: breakpoint === "mobile" ? "column" : "row",
                gap: "16px",
              }}
            >
              <button
                onClick={() => {
                  if (!pincodeVerified) {
                    toast.error("Please verify your pincode first");
                    return;
                  }
                  const message = formatProductMessage({
                    ...product,
                    quantity: 1,
                  });
                  sendWhatsAppMessage(message);
                }}
                disabled={!pincodeVerified}
                style={{
                  flex: 1,
                  padding: breakpoint === "mobile" ? "14px 28px" : "16px 32px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: breakpoint === "mobile" ? "16px" : "18px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  backgroundColor: pincodeVerified ? "#25D366" : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: pincodeVerified ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  opacity: pincodeVerified ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (pincodeVerified) {
                    e.target.style.backgroundColor = "#20BA5A";
                    e.target.style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (pincodeVerified) {
                    e.target.style.backgroundColor = "#25D366";
                    e.target.style.transform = "scale(1)";
                  }
                }}
              >
                <FaWhatsapp size={24} />
                ORDER NOW
              </button>
              <button
                onClick={() => {
                  if (!pincodeVerified) {
                    toast.error("Please verify your pincode first");
                    return;
                  }
                  addToCart({
                    ...product,
                    variation: "default",
                  });
                  toast.success("Product added to cart!");
                }}
                disabled={!pincodeVerified}
                style={{
                  flex: 1,
                  padding: breakpoint === "mobile" ? "14px 28px" : "16px 32px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: breakpoint === "mobile" ? "16px" : "18px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  backgroundColor: pincodeVerified ? "#000" : "#ccc",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: pincodeVerified ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  opacity: pincodeVerified ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (pincodeVerified) {
                    e.target.style.backgroundColor = "#333";
                    e.target.style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (pincodeVerified) {
                    e.target.style.backgroundColor = "#000";
                    e.target.style.transform = "scale(1)";
                  }
                }}
              >
                <FaShoppingCart size={20} />
                ADD TO CART
              </button>
            </div>

            {/* Pincode Verification Section */}
            <div
              style={{
                marginTop: "32px",
                padding: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "12px",
                border: "1px solid #eee",
              }}
            >
              <div
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <label
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === "mobile" ? "14px" : "16px",
                    fontWeight: 600,
                    color: "#333",
                    margin: 0,
                  }}
                >
                  Delivery Pincode *
                </label>

                {/* Only show badge when pincode is actually verified */}
                {pincodeVerified && pincodeError === "" && (
                  <span
                    style={{
                      backgroundColor: "#4caf50",
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    ✓ Verified
                  </span>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexDirection: breakpoint === "mobile" ? "column" : "row",
                }}
              >
                <input
                  type="text"
                  value={pincode}
                  onChange={handlePincodeInputChange}
                  placeholder="Enter your pincode"
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: pincodeError ? "2px solid #ff4444" : "1px solid #ddd",
                    borderRadius: "8px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    color: "#333",
                  }}
                />
                <button
                  onClick={handleVerifyPincode}
                  style={{
                    padding: breakpoint === "mobile" ? "12px 24px" : "12px 32px",
                    backgroundColor: "#111",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === "mobile" ? "14px" : "16px",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#333";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#111";
                  }}
                >
                  Verify
                </button>
              </div>

              {pincodeError && (
                <p
                  style={{
                    color: "#ff4444",
                    fontSize: "13px",
                    marginTop: "8px",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {pincodeError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Related Products/Variations Section */}
        {relatedProducts.length > 0 && (
          <div style={{ marginBottom: "60px" }}>
            <h2
              style={{
                fontFamily: "Nunito Sans",
                fontSize: breakpoint === "mobile" ? "24px" : "28px",
                marginBottom: "18px",
                color: "#111",
                fontWeight: 600,
              }}
            >
              Available Variations
            </h2>
            <div
              style={{
                display: breakpoint === "mobile" ? "flex" : "grid",
                flexDirection: breakpoint === "mobile" ? "row" : undefined,
                overflowX: breakpoint === "mobile" ? "auto" : undefined,
                WebkitOverflowScrolling: breakpoint === "mobile" ? "touch" : undefined,
                gap: "20px",
                paddingBottom: breakpoint === "mobile" ? "8px" : undefined,
                gridTemplateColumns: breakpoint === "mobile" ? undefined : breakpoint === "tablet" ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
              }}
            >
              {relatedProducts.map((variation) => (
                <div
                  key={variation.id}
                  onClick={() => handleProductSelect(variation)}
                  style={{
                    cursor: "pointer",
                    padding: "16px",
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "2px solid #eee",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                    minWidth: breakpoint === "mobile" ? "240px" : undefined,
                    flex: breakpoint === "mobile" ? "0 0 240px" : undefined,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#000";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#eee";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Badge */}
                  {variation.badge && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "#000",
                        color: "#fff",
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: breakpoint === "mobile" ? "12px" : "13px",
                        zIndex: 10,
                        fontWeight: 600,
                      }}
                    >
                      {variation.badge}
                    </div>
                  )}

                  {/* Product Image */}
                  <div
                    style={{
                      width: "100%",
                      height: breakpoint === "mobile" ? "150px" : "180px",
                      marginBottom: "12px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      backgroundColor: "#f9f9f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={variation.image}
                      alt={variation.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: "8px",
                      }}
                    />
                  </div>

                  {/* Product Name */}
                  <h3
                    style={{
                      fontFamily: "Nunito Sans",
                      fontSize: breakpoint === "mobile" ? "16px" : "18px",
                      marginBottom: "8px",
                      color: "#111",
                      lineHeight: "1.2",
                      fontWeight: 600,
                    }}
                  >
                    {variation.name}
                  </h3>

                  {/* Product Description */}
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: breakpoint === "mobile" ? "13px" : "15px",
                      color: "#666",
                      marginBottom: "12px",
                      lineHeight: "1.4",
                      flexGrow: 1,
                    }}
                  >
                    {variation.description}
                  </p>

                  {/* Price */}
                  <div
                    style={{
                      fontFamily: "Nunito Sans",
                      fontSize: breakpoint === "mobile" ? "16px" : "18px",
                      color: "#111",
                      fontWeight: 700,
                      marginTop: "auto",
                    }}
                  >
                    {variation.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients Section */}
        <div style={{ marginBottom: "60px" }}>
          <h2
            style={{
              fontFamily: "Nunito Sans",
              fontSize: breakpoint === "mobile" ? "22px" : "26px",
              marginBottom: "18px",
              color: "#111",
              fontWeight: 600,
            }}
          >
            Ingredients
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {product.ingredients.map((ingredient, index) => (
              <li
                key={index}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: breakpoint === "mobile" ? "14px" : "16px",
                  padding: "12px 0",
                  borderBottom: index < product.ingredients.length - 1 ? "1px solid #eee" : "none",
                  color: "#333",
                }}
              >
                • {ingredient}
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits Section */}
        <div style={{ marginBottom: "60px" }}>
          <h2
            style={{
              fontFamily: "Nunito Sans",
              fontSize: breakpoint === "mobile" ? "22px" : "26px",
              marginBottom: "18px",
              color: "#111",
              fontWeight: 600,
            }}
          >
            Benefits
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {product.benefits.map((benefit, index) => (
              <li
                key={index}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: breakpoint === "mobile" ? "14px" : "16px",
                  padding: "12px 0",
                  borderBottom: index < product.benefits.length - 1 ? "1px solid #eee" : "none",
                  color: "#333",
                }}
              >
                ✓ {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Nutritional Information */}
        <div style={{ marginBottom: "60px" }}>
          <h2
            style={{
              fontFamily: "Nunito Sans",
              fontSize: breakpoint === "mobile" ? "22px" : "26px",
              marginBottom: "18px",
              color: "#111",
              fontWeight: 600,
            }}
          >
            Nutritional Information
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: breakpoint === "mobile" ? "1fr 1fr" : "repeat(3, 1fr)",
              gap: "16px",
            }}
          >
            {Object.entries(product.nutritionalInfo).map(([key, value]) => (
              <div
                key={key}
                style={{
                  padding: "16px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === "mobile" ? "13px" : "14px",
                    fontWeight: "700",
                    marginBottom: "8px",
                    textTransform: "capitalize",
                  }}
                >
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: breakpoint === "mobile" ? "18px" : "20px",
                    color: "#666",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <h2
              style={{
                fontFamily: "Nunito Sans",
                fontSize: breakpoint === "mobile" ? "22px" : "26px",
                color: "#111",
                margin: 0,
                fontWeight: 600,
              }}
            >
              Reviews
            </h2>
            <span
              style={{
                fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
                fontSize: breakpoint === "mobile" ? "18px" : "22px",
                color: "#666",
              }}
            >
              {product.reviewCount}+
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: breakpoint === "mobile" ? "1fr" : breakpoint === "tablet" ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
              gap: "24px",
            }}
          >
            {product.reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "12px",
                  border: "1px solid #eee",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: "#FFD700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "18px",
                      color: "#000",
                      fontWeight: 700,
                    }}
                  >
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "16px",
                        color: "#111",
                        marginBottom: "4px",
                        fontWeight: 600,
                      }}
                    >
                      {review.name}
                    </div>
                    <div style={{ color: "#FFD700", fontSize: "16px" }}>
                      {"★".repeat(review.rating)}
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontFamily: "'Just_Me_Again_Down_Here-Regular', Helvetica",
                    fontSize: breakpoint === "mobile" ? "16px" : "18px",
                    lineHeight: "1.5",
                    color: "#333",
                    margin: 0,
                  }}
                >
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

