import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productDetails } from "../config/productDetails";
import { formatProductMessage, sendWhatsAppMessage } from "../utils/whatsapp";
import { FaPlus, FaMinus, FaTimes, FaBolt, FaLeaf, FaShieldAlt, FaHeart, FaCheck } from "react-icons/fa";
import LiveCommunityHub from "./LiveCommunityHub";
import ProductsShowcase from "./ProductsShowcase";
import HeroCarousel from "../pages/HeroCarousel";
import HyperBiteManifesto from "./OurSection";
import CinematicSceneTailwind from "./CinematicSceneTailwind";

export default function LandingView({ onEnterPremiumMode, breakpoint }) {
  const products = Object.values(productDetails);
  const [quantities, setQuantities] = useState({});
const navigate = useNavigate();

  const getQuantity = (productId) => quantities[productId] || 1;

  const handleIncreaseQuantity = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const handleDecreaseQuantity = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  return (
    <div style={{paddingTop:"100px"}} className="bg-gradient-to-b from-amber-50 to-white min-h-screen">

      {/* ================= HERO ================= */}
<HeroCarousel  onEnterPremiumMode={onEnterPremiumMode}/>

      {/* Divider */}
      {/* <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div> */}

     {/* ================= PRODUCTS ================= */}
<section className="max-w-7xl mt-10 mx-auto px-5 md:px-10 py-16">

  {/* Heading */}
  <div className="text-center mb-10">
    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
      Available Now
    </h2>
    <p className="text-gray-500 text-sm mt-2">
      Clean, powerful, and ready to fuel your day
    </p>
  </div>

  {/* Grid (same cards everywhere) */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {products.slice(0, 3).map((product) => (
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        key={product.id}
        className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 items-center hover:shadow-sm transition cursor-pointer"
      >
        {/* Image */}
        <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <img
            src={product.packImg}
            alt={product.name}
            className="h-full object-contain"
          />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
            {product.description}
          </p>

          <div className="text-sm font-semibold text-gray-900 mb-2">
            ₹{product.price.split(" ")[0]}
          </div>

          {/* Controls */}
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDecreaseQuantity(product.id)}
                className="w-6 h-6 border rounded flex items-center justify-center text-gray-600"
              >
                <FaMinus size={9} />
              </button>

              <span className="text-xs font-medium">
                {getQuantity(product.id)}
              </span>

              <button
                onClick={() => handleIncreaseQuantity(product.id)}
                className="w-6 h-6 bg-gray-900 text-white rounded flex items-center justify-center"
              >
                <FaPlus size={9} />
              </button>
            </div>

            <button
              onClick={() => {
                const message = formatProductMessage({
                  ...product,
                  quantity: getQuantity(product.id),
                });

                sendWhatsAppMessage(message);

                setQuantities((prev) => ({
                  ...prev,
                  [product.id]: 1,
                }));
              }}
              className="text-xs font-medium text-gray-900 border px-3 py-1 rounded hover:bg-gray-900 hover:text-white transition"
            >
              Add
            </button>
          </div> */}
        </div>
      </div>
    ))}
  </div>

  {/* View All Button (bottom center) */}
  <div className="flex justify-center mt-10">
    <button
      onClick={() => navigate("/products")}
      className="px-8 py-3 rounded-full border border-gray-300 text-gray-800 text-sm font-medium hover:bg-gray-900 hover:text-white transition"
    >
      View All Products →
    </button>
  </div>
</section>

     <section className="py-16 md:py-24 bg-white">
  <div className="max-w-6xl mx-auto px-5 md:px-10">

    {/* Heading */}
    <h2 className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 mb-14">
      The Industry <span className="text-gray-400">vs.</span> HyperBite
    </h2>

    {/* ================= DESKTOP TABLE ================= */}
    <div className="hidden md:block border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

      {/* Header */}
      <div className="grid grid-cols-3 bg-gray-50 text-gray-700 font-semibold text-lg">
        <div className="p-5"></div>
        <div className="p-5 text-center border-l border-gray-200">Other Brands</div>
        <div className="p-5 text-center border-l border-gray-200 text-black font-bold">
          HyperBite
        </div>
      </div>

      {/* Rows */}
      {[
        {
          title: "Sweetener Source",
          other: "Jaggery / Brown Sugar",
          hyper: "Raw Honey",
        },
        {
          title: "Nutrition",
          other: "Low Nutrients",
          hyper: "Fiber + Iron (Dates)",
        },
        {
          title: "Energy",
          other: "Energy Crash",
          hyper: "Sustained Energy",
        },
        {
          title: "Performance",
          other: "Inconsistent",
          hyper: "Clean & Consistent",
        },
        {
          title: "Purpose",
          other: "Just a snack",
          hyper: "Part of your lifestyle",
        },
      ].map((row, idx) => (
        <div
          key={idx}
          className="grid grid-cols-3 border-t border-gray-200 text-gray-700"
        >
          <div className="p-5 font-semibold text-gray-900">
            {row.title}
          </div>

          <div className="p-5 text-center border-l border-gray-200 flex items-center justify-center gap-2">
            <FaTimes className="text-gray-400" />
            {row.other}
          </div>

          <div className="p-5 text-center border-l border-gray-200 flex items-center justify-center gap-2 font-semibold text-black">
            <FaCheck className="text-black" />
            {row.hyper}
          </div>
        </div>
      ))}
    </div>

    {/* ================= MOBILE COMPARISON ================= */}
    <div className="md:hidden space-y-6">

      {[
        {
          title: "Sweetener Source",
          other: "Jaggery / Brown Sugar",
          hyper: "Raw Honey",
        },
        {
          title: "Nutrition",
          other: "Low Nutrients",
          hyper: "Fiber + Iron (Dates)",
        },
        {
          title: "Energy",
          other: "Energy Crash",
          hyper: "Sustained Energy",
        },
        {
          title: "Performance",
          other: "Inconsistent",
          hyper: "Clean & Consistent",
        },
        {
          title: "Purpose",
          other: "Just a snack",
          hyper: "Part of your lifestyle",
        },
      ].map((row, idx) => (
        <div
          key={idx}
          className="border border-gray-200 rounded-xl p-5"
        >
          {/* Feature */}
          <h4 className="font-bold text-gray-900 mb-4 text-lg">
            {row.title}
          </h4>

          {/* Comparison Row */}
          <div className="flex items-center justify-between text-sm">

            {/* Other */}
            <div className="flex items-center gap-2 text-gray-500">
              <FaTimes className="text-gray-400" />
              <span>{row.other}</span>
            </div>

            {/* Hyper */}
            <div className="flex items-center gap-2 font-semibold text-black">
              <FaCheck />
              <span>{row.hyper}</span>
            </div>

          </div>
        </div>
      ))}
    </div>

  </div>
</section>

<HyperBiteManifesto />
<ProductsShowcase />
<CinematicSceneTailwind />
<LiveCommunityHub />
    </div>
  );
}