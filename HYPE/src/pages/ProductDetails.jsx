import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductsFromAPI } from "../config/productDetails";
import product3dModels from "../config/product3dModels";
import { useCart } from "../store/hooks/useCart";
import { formatProductMessage, sendWhatsAppMessage } from "../utils/whatsapp";
import { FaWhatsapp, FaShoppingCart, FaCube, FaArrowLeft } from "react-icons/fa";
import { IoImages } from "react-icons/io5";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ProductViewer from "../components/ProductViewer";

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [breakpoint, setBreakpoint] = useState("desktop");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState("photo");

  useEffect(() => {
    const updateBreakpoint = () => {
      const w = window.innerWidth;
      setBreakpoint(w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop");
    };
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const merged = await fetchProductsFromAPI();
        const found = merged[slug] || Object.values(merged).find(p => p.slug === slug || p.id === slug);
        if (found) {
          setProduct(found);
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, navigate]);

  const handleProductSelect = (variation) => {
    setProduct(prev => ({
      ...prev,
      name: variation.name,
      description: variation.description,
      price: variation.price,
      image: variation.image,
      images: [variation.image, ...(prev.images || []).slice(1)],
    }));
    setSelectedImageIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!product) {
    return (
      <div style={{ paddingTop: "120px", textAlign: "center", fontFamily: "'Inter', sans-serif", color: "#666" }}>
        {loading ? <Spinner text="Loading product..." /> : "Product not found"}
      </div>
    );
  }

  const isMobile = breakpoint === "mobile";
  const isTablet = breakpoint === "tablet";
  const images = product?.images || (product?.image ? [product.image] : []);
  const modelSrc = product3dModels[slug];

  const sectionStyle = {
    padding: isMobile ? "0 16px" : isTablet ? "0 32px" : "0 48px",
    maxWidth: "1280px",
    margin: "0 auto",
  };

  const slugCategory = {
    "cashew-charge": "nuts",
    "seed-boost": "seeds",
  };
  const category = slugCategory[slug];

  const baseVariations = {
    nuts: [
      { id: "nuts-salted", name: "Salted Nuts Mix", description: "Premium mixed nuts with a perfect touch of salt.", price: "65 RS", image: "/assets/wallnut.webp", badge: "Salted" },
      { id: "nuts-unsalted", name: "Unsalted Nuts Mix", description: "Pure natural nuts without any added salt.", price: "60 RS", image: "/assets/pumpkinseed.webp", badge: "Unsalted" },
      { id: "nuts-pack8", name: "Nuts Mix - Pack of 8", description: "Get 8 packs and save more! Perfect for families.", price: "450 RS", image: "/assets/sunflowerseed.webp", badge: "Pack of 8" },
      { id: "nuts-honey", name: "Honey Roasted Nuts", description: "Sweet and crunchy honey roasted nuts mix.", price: "70 RS", image: "/assets/dateorange.webp", badge: "Honey" },
    ],
    dates: [
      { id: "dates-ajwa", name: "Ajwa Dates", description: "Premium Ajwa dates, known for their soft texture.", price: "80 RS", image: "/assets/date.webp", badge: "Ajwa" },
      { id: "dates-khalas", name: "Khalas Dates", description: "Sweet and tender Khalas dates.", price: "65 RS", image: "/assets/dateorange.webp", badge: "Khalas" },
      { id: "dates-pack8", name: "Dates - Pack of 8", description: "Get 8 packs of premium dates and save!", price: "480 RS", image: "/assets/date.webp", badge: "Pack of 8" },
      { id: "dates-medjool", name: "Medjool Dates", description: "Large and luscious Medjool dates.", price: "90 RS", image: "/assets/date.webp", badge: "Medjool" },
    ],
    seeds: [
      { id: "seeds-sunflower", name: "Sunflower Seeds", description: "Premium roasted sunflower seeds.", price: "45 RS", image: "/assets/sunflowerseed.webp", badge: "Sunflower" },
      { id: "seeds-pumpkin", name: "Pumpkin Seeds", description: "Crunchy and nutritious pumpkin seeds.", price: "50 RS", image: "/assets/pumpkinseed.webp", badge: "Pumpkin" },
      { id: "seeds-pack8", name: "Seeds Mix - Pack of 8", description: "Mixed seeds collection in pack of 8.", price: "360 RS", image: "/assets/sunflowershell.webp", badge: "Pack of 8" },
      { id: "seeds-mixed", name: "Mixed Seeds", description: "Variety pack with all seed types.", price: "60 RS", image: "/assets/sunflowerseed.webp", badge: "Mixed" },
    ],
  };
  const relatedProducts = category ? baseVariations[category] || [] : [];

  const isDesktop = !isMobile && !isTablet;

  return (
    <div style={{ minHeight: "100vh", paddingTop: isMobile ? "80px" : "100px", paddingBottom: isMobile ? "40px" : "60px", background: "#fff" }}>
      {loading ? (
        <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Spinner text="Loading product..." />
        </div>
      ) : isDesktop ? (
        <div style={{ display: "flex", gap: "48px", ...sectionStyle, alignItems: "flex-start" }}>
          {/* Left: Sticky Image / 3D Viewer */}
          <div style={{ flex: "0 0 440px", position: "sticky", top: "100px", alignSelf: "flex-start" }}>
            <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "#666", marginBottom: "12px" }}>
              <FaArrowLeft size={14} />
              Back
            </button>
            {/* View Switcher */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "16px", background: "#f5f5f5", borderRadius: "10px", padding: "4px", width: "fit-content" }}>
              <button onClick={() => setViewMode("photo")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: "none", borderRadius: "8px", background: viewMode === "photo" ? "#fff" : "transparent", boxShadow: viewMode === "photo" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: viewMode === "photo" ? "#111" : "#666", transition: "all 0.2s ease" }}>
                <IoImages size={16} />
                Photo
              </button>
              {modelSrc && (
                <button onClick={() => setViewMode("360")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: "none", borderRadius: "8px", background: viewMode === "360" ? "#fff" : "transparent", boxShadow: viewMode === "360" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: viewMode === "360" ? "#111" : "#666", transition: "all 0.2s ease" }}>
                  <FaCube size={14} />
                  360 View
                </button>
              )}
            </div>

            {viewMode === "photo" ? (
              <>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <img src={images[selectedImageIndex] || product.image} alt={product.name} style={{ width: "100%", maxWidth: "440px", height: "440px", objectFit: "contain", borderRadius: "8px", border: "1px solid #eee" }} />
                </div>
                {images.length > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                    {images.map((img, index) => (
                      <button key={index} onClick={() => setSelectedImageIndex(index)} style={{ padding: 0, border: selectedImageIndex === index ? "2px solid #000" : "2px solid #ddd", borderRadius: "8px", cursor: "pointer", background: "transparent", overflow: "hidden", width: "80px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={img} alt={`${product.name} view ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : modelSrc ? (
              <ProductViewer src={modelSrc} alt={product.name} style={{ width: "100%", height: "500px" }} />
            ) : null}
          </div>

          {/* Right: Scrollable Content */}
          <div style={{ flex: "1", minWidth: 0 }}>
            {/* Product Name */}
            <h1 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "40px", fontWeight: 700, color: "#111", margin: "0 0 8px", lineHeight: 1.2 }}>
              {product.name}
            </h1>

            <div style={{ marginBottom: "20px", display: "flex", alignItems: "baseline", gap: "10px" }}>
              <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "36px", fontWeight: 800, color: "#111" }}>
                {product.price}
              </span>
              {product.compareAtPrice && (
                <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "22px", color: "#999", textDecoration: "line-through", fontWeight: 400 }}>
                  {product.compareAtPrice}
                </span>
              )}
            </div>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", lineHeight: 1.7, color: "#555", marginBottom: "24px" }}>
              {product.description}
            </p>

            {/* Action Buttons */}
            {product.stock === "Available" ? (
              <div style={{ display: "flex", gap: "16px", marginBottom: "48px" }}>
                <button onClick={() => { const msg = formatProductMessage({ ...product, quantity: 1 }); sendWhatsAppMessage(msg); }} style={{ flex: 1, padding: "18px 36px", fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 700, letterSpacing: "0.04em", backgroundColor: "#25D366", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                  <FaWhatsapp size={26} />
                  ORDER NOW
                </button>
                <button onClick={() => { addToCart({ ...product, variation: "default" }); toast.success("Product added to cart!"); }} style={{ flex: 1, padding: "18px 36px", fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 700, letterSpacing: "0.04em", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                  <FaShoppingCart size={22} />
                  ADD TO CART
                </button>
              </div>
            ) : (
              <button style={{ padding: "18px 36px", fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 700, letterSpacing: "0.04em", backgroundColor: "#888", color: "#fff", border: "none", borderRadius: "12px", cursor: "not-allowed", marginBottom: "48px" }}>
                Out of Stock
              </button>
            )}

            {/* Ingredients */}
            {product.ingredients?.length > 0 && (
              <div style={{ marginBottom: "48px" }}>
                <h2 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "24px", fontWeight: 600, color: "#111", margin: "0 0 16px" }}>
                  Ingredients
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {product.ingredients.map((item, i) => (
                    <span key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#444", background: "#f5f5f5", padding: "6px 16px", borderRadius: "20px" }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {product.benefits?.length > 0 && (
              <div style={{ marginBottom: "48px" }}>
                <h2 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "24px", fontWeight: 600, color: "#111", margin: "0 0 16px" }}>
                  Benefits
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {product.benefits.map((benefit, i) => (
                    <li key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#444", padding: "8px 0", borderBottom: i < product.benefits.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                      ✓ {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nutritional Info */}
            {product.nutritionalInfo && Object.keys(product.nutritionalInfo).length > 0 && (
              <div style={{ marginBottom: "48px" }}>
                <h2 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "24px", fontWeight: 600, color: "#111", margin: "0 0 16px" }}>
                  Nutritional Information
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                    <div key={key} style={{ padding: "12px", background: "#f9f9f9", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, color: "#111", textTransform: "capitalize", marginBottom: "4px" }}>
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#666" }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {product.reviews?.length > 0 && (
              <div style={{ marginBottom: "48px" }}>
                <h2 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "24px", fontWeight: 600, color: "#111", margin: "0 0 16px" }}>
                  Reviews ({product.reviewCount})
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {product.reviews.map((review) => (
                    <div key={review.id} style={{ padding: "14px 18px", background: "#faf8f5", borderRadius: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: "#111" }}>{review.name}</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#d97706" }}>
                          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#555", margin: 0, lineHeight: 1.6 }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Variations */}
            {relatedProducts.length > 0 && (
              <div>
                <h2 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "24px", fontWeight: 600, color: "#111", margin: "0 0 16px" }}>
                  Available Variations
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                  {relatedProducts.map((variation) => (
                    <div key={variation.id} style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "12px", border: "2px solid #eee", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#f59e0b", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, zIndex: 10, letterSpacing: "0.02em" }}>
                        Coming Soon
                      </div>
                      {variation.badge && (
                        <div style={{ position: "absolute", top: "8px", left: "8px", backgroundColor: "#000", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, zIndex: 10 }}>
                          {variation.badge}
                        </div>
                      )}
                      <div style={{ width: "100%", height: "140px", marginBottom: "12px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={variation.image} alt={variation.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }} />
                      </div>
                      <h3 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "15px", marginBottom: "6px", color: "#111", lineHeight: 1.2, fontWeight: 600 }}>{variation.name}</h3>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#666", marginBottom: "10px", lineHeight: 1.4, flexGrow: 1 }}>{variation.description}</p>
                      <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: "15px", color: "#111", fontWeight: 700, marginTop: "auto" }}>{variation.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Mobile / Tablet — stacked layout */
        <div style={{ ...sectionStyle }}>
          {/* Image / 3D Viewer */}
          <div style={{ marginBottom: "24px" }}>
            <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 0 12px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: "#666" }}>
              <FaArrowLeft size={14} />
              Back
            </button>
            <div style={{ display: "flex", gap: "4px", marginBottom: "16px", background: "#f5f5f5", borderRadius: "10px", padding: "4px", width: "fit-content" }}>
              <button onClick={() => setViewMode("photo")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: "none", borderRadius: "8px", background: viewMode === "photo" ? "#fff" : "transparent", boxShadow: viewMode === "photo" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: viewMode === "photo" ? "#111" : "#666", transition: "all 0.2s ease" }}>
                <IoImages size={16} />
                Photo
              </button>
              {modelSrc && (
                <button onClick={() => setViewMode("360")} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", border: "none", borderRadius: "8px", background: viewMode === "360" ? "#fff" : "transparent", boxShadow: viewMode === "360" ? "0 1px 3px rgba(0,0,0,0.1)" : "none", cursor: "pointer", fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600, color: viewMode === "360" ? "#111" : "#666", transition: "all 0.2s ease" }}>
                  <FaCube size={14} />
                  360 View
                </button>
              )}
            </div>

            {viewMode === "photo" ? (
              <>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <img src={images[selectedImageIndex] || product.image} alt={product.name} style={{ width: "100%", maxWidth: isTablet ? "500px" : "100%", height: isMobile ? "auto" : "400px", objectFit: "contain", borderRadius: "8px", border: "1px solid #eee" }} />
                </div>
                {images.length > 1 && (
                  <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
                    {images.map((img, index) => (
                      <button key={index} onClick={() => setSelectedImageIndex(index)} style={{ padding: 0, border: selectedImageIndex === index ? "2px solid #000" : "2px solid #ddd", borderRadius: "8px", cursor: "pointer", background: "transparent", overflow: "hidden", width: isMobile ? "60px" : "80px", height: isMobile ? "60px" : "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={img} alt={`${product.name} view ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : modelSrc ? (
              <ProductViewer src={modelSrc} alt={product.name} style={{ width: "100%", height: isMobile ? "320px" : "450px" }} />
            ) : null}
          </div>

          {/* Product Info + All Sections */}
          <div>
            <h1 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: isMobile ? "28px" : "34px", fontWeight: 700, color: "#111", margin: "0 0 8px", lineHeight: 1.2 }}>
              {product.name}
            </h1>

            <div style={{ marginBottom: "20px", display: "flex", alignItems: "baseline", gap: "10px" }}>
              <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: isMobile ? "28px" : "36px", fontWeight: 800, color: "#111" }}>
                {product.price}
              </span>
              {product.compareAtPrice && (
                <span style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: isMobile ? "18px" : "22px", color: "#999", textDecoration: "line-through", fontWeight: 400 }}>
                  {product.compareAtPrice}
                </span>
              )}
            </div>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? "14px" : "15px", lineHeight: 1.7, color: "#555", marginBottom: "24px" }}>
              {product.description}
            </p>

            {/* Action Buttons */}
            {product.stock === "Available" ? (
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "14px", marginBottom: "40px" }}>
                <button onClick={() => { const msg = formatProductMessage({ ...product, quantity: 1 }); sendWhatsAppMessage(msg); }} style={{ flex: 1, padding: isMobile ? "16px 28px" : "18px 36px", fontFamily: "'Inter', sans-serif", fontSize: isMobile ? "16px" : "18px", fontWeight: 700, letterSpacing: "0.04em", backgroundColor: "#25D366", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                  <FaWhatsapp size={isMobile ? 22 : 26} />
                  ORDER NOW
                </button>
                <button onClick={() => { addToCart({ ...product, variation: "default" }); toast.success("Product added to cart!"); }} style={{ flex: 1, padding: isMobile ? "16px 28px" : "18px 36px", fontFamily: "'Inter', sans-serif", fontSize: isMobile ? "16px" : "18px", fontWeight: 700, letterSpacing: "0.04em", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                  <FaShoppingCart size={isMobile ? 18 : 22} />
                  ADD TO CART
                </button>
              </div>
            ) : (
              <button style={{ padding: isMobile ? "16px 28px" : "18px 36px", fontFamily: "'Inter', sans-serif", fontSize: isMobile ? "16px" : "18px", fontWeight: 700, letterSpacing: "0.04em", backgroundColor: "#888", color: "#fff", border: "none", borderRadius: "12px", cursor: "not-allowed", marginBottom: "40px" }}>
                Out of Stock
              </button>
            )}

            {/* Ingredients */}
            {product.ingredients?.length > 0 && (
              <div style={{ marginBottom: "40px" }}>
                <h2 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: isMobile ? "20px" : "24px", fontWeight: 600, color: "#111", margin: "0 0 16px" }}>
                  Ingredients
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {product.ingredients.map((item, i) => (
                    <span key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#444", background: "#f5f5f5", padding: "6px 16px", borderRadius: "20px" }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {product.benefits?.length > 0 && (
              <div style={{ marginBottom: "40px" }}>
                <h2 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: isMobile ? "20px" : "24px", fontWeight: 600, color: "#111", margin: "0 0 16px" }}>
                  Benefits
                </h2>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {product.benefits.map((benefit, i) => (
                    <li key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#444", padding: "8px 0", borderBottom: i < product.benefits.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                      ✓ {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nutritional Info */}
            {product.nutritionalInfo && Object.keys(product.nutritionalInfo).length > 0 && (
              <div style={{ marginBottom: "40px" }}>
                <h2 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: isMobile ? "20px" : "24px", fontWeight: 600, color: "#111", margin: "0 0 16px" }}>
                  Nutritional Information
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: isMobile ? "8px" : "12px" }}>
                  {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                    <div key={key} style={{ padding: "12px", background: "#f9f9f9", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 600, color: "#111", textTransform: "capitalize", marginBottom: "4px" }}>
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#666" }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {product.reviews?.length > 0 && (
              <div style={{ marginBottom: "40px" }}>
                <h2 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: isMobile ? "20px" : "24px", fontWeight: 600, color: "#111", margin: "0 0 16px" }}>
                  Reviews ({product.reviewCount})
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {product.reviews.map((review) => (
                    <div key={review.id} style={{ padding: "14px 18px", background: "#faf8f5", borderRadius: "10px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: "#111" }}>{review.name}</span>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#d97706" }}>
                          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </span>
                      </div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#555", margin: 0, lineHeight: 1.6 }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Variations */}
            {relatedProducts.length > 0 && (
              <div>
                <h2 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: isMobile ? "20px" : "24px", fontWeight: 600, color: "#111", margin: "0 0 16px" }}>
                  Available Variations
                </h2>
                <div style={{ display: isMobile ? "flex" : "grid", flexDirection: isMobile ? "row" : undefined, overflowX: isMobile ? "auto" : undefined, gap: "16px", paddingBottom: isMobile ? "8px" : undefined, gridTemplateColumns: isMobile ? undefined : "repeat(2, 1fr)" }}>
                  {relatedProducts.map((variation) => (
                    <div key={variation.id} style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "12px", border: "2px solid #eee", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", overflow: "hidden", minWidth: isMobile ? "220px" : undefined, flex: isMobile ? "0 0 220px" : undefined }}>
                      <div style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#f59e0b", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, zIndex: 10, letterSpacing: "0.02em" }}>
                        Coming Soon
                      </div>
                      {variation.badge && (
                        <div style={{ position: "absolute", top: "8px", left: "8px", backgroundColor: "#000", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, zIndex: 10 }}>
                          {variation.badge}
                        </div>
                      )}
                      <div style={{ width: "100%", height: isMobile ? "140px" : "150px", marginBottom: "12px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={variation.image} alt={variation.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }} />
                      </div>
                      <h3 style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: isMobile ? "15px" : "16px", marginBottom: "6px", color: "#111", lineHeight: 1.2, fontWeight: 600 }}>{variation.name}</h3>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#666", marginBottom: "10px", lineHeight: 1.4, flexGrow: 1 }}>{variation.description}</p>
                      <div style={{ fontFamily: "'Nunito Sans', sans-serif", fontSize: isMobile ? "15px" : "16px", color: "#111", fontWeight: 700, marginTop: "auto" }}>{variation.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
