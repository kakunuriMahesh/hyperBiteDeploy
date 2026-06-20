import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductSelector from "../components/ProductSelector";
import HeroBanner from "../components/HeroBanner";
import { scrollTo } from "../utils/SmoothScroll";

const ExplorePage = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState("nuts");
  const [breakpoint, setBreakpoint] = useState("desktop");

  useEffect(() => {
    const updateBreakpoint = () => {
      const w = window.innerWidth;
      if (w < 768) setBreakpoint("mobile");
      else if (w < 1024) setBreakpoint("tablet");
      else setBreakpoint("desktop");
    };
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  const handleProductSelect = (productId) => {
    setSelectedProduct(productId);
    scrollTo(0);
  };

  const handleOpenDetails = () => {
    navigate(`/product/${selectedProduct}`);
  };

  return (
    <div style={{ paddingTop: "70px" }}>
      <ProductSelector
        selectedProduct={selectedProduct}
        onProductSelect={handleProductSelect}
      />
      <HeroBanner
        key={selectedProduct}
        productType={selectedProduct}
        onOpenDetails={handleOpenDetails}
      />
    </div>
  );
};

export default ExplorePage;
