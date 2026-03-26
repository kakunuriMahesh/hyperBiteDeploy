import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productDetails } from "../config/productDetails";
import { formatProductMessage, sendWhatsAppMessage } from "../utils/whatsapp";
import { FaPlus, FaMinus, FaTimes, FaBolt, FaLeaf, FaShieldAlt, FaHeart, FaCheck } from "react-icons/fa";
import OurStorySection from "../pages/OurStorySection";
import LiveCommunityHub from "./LiveCommunityHub";
import ProductsShowcase from "./ProductsShowcase";

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
<section className="min-h-screen flex flex-col justify-center items-center text-center px-5 md:px-10 relative overflow-hidden">

  {/* Subtle Background Glow */}
  <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-white to-white -z-10"></div>

  <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
      Stop Sweet-Talking Your Health.
      
      Jaggery is Still Sugar.
    </h1>
    <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-emerald-600 mb-6 tracking-tight leading-tight">
      We're Still Different.
    </h2>

    <p className="text-base md:text-lg text-gray-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
      We stopped pretending Jaggery was the answer. It’s not. It’s just sugar with a better publicist. HyperBite is built on the uncompromising power of real ingredients like Raw Honey and Dates to fuel your life without the crash. No excuses. No compromises.
    </p>

    {/* CTA */}
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      <button
        onClick={() =>
          document
            .getElementById("products")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-3 rounded-full text-base font-semibold shadow-md transition transform hover:scale-105"
      >
        Shop Now
      </button>

      <button
        onClick={onEnterPremiumMode}
        className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 px-7 py-3 rounded-full text-base font-semibold transition"
      >
        Future Collections →
      </button>
    </div>
  </div>

  {/* ===== PREMIUM MARQUEE RIBBON (SEAMLESS) ===== */}
<div className="absolute bottom-0 left-0 w-full overflow-hidden bg-black py-3">

  <div className="marquee-wrapper">
    <div className="marquee-track">

      {/* ORIGINAL */}
      <div className="marquee-content">
        <span>0% Added Jaggery</span>
        <span>0% Refined Sugar</span>
        <span>Sweetened with Raw Honey & Dates</span>
      </div>

      {/* DUPLICATE (IMPORTANT) */}
      <div className="marquee-content">
        <span>0% Added Jaggery</span>
        <span>0% Refined Sugar</span>
        <span>Sweetened with Raw Honey & Dates</span>
      </div>

      <div className="marquee-content">
        <span>0% Added Jaggery</span>
        <span>0% Refined Sugar</span>
        <span>Sweetened with Raw Honey & Dates</span>
      </div>

    </div>
  </div>

  <style>{`
    .marquee-wrapper {
      overflow: hidden;
      width: 100%;
    }

    .marquee-track {
      display: flex;
      width: max-content;
      animation: marquee-scroll 18s linear infinite;
    }

    .marquee-content {
      display: flex;
      gap: 60px;
      padding-right: 60px;
      white-space: nowrap;
    }

    .marquee-content span {
      color: white;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.5px;
    }

    @media (min-width: 768px) {
      .marquee-content span {
        font-size: 16px;
      }
    }

    @keyframes marquee-scroll {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-50%);
      }
    }
  `}</style>
</div>
</section>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

     {/* ================= PRODUCTS ================= */}
<section className="max-w-7xl mx-auto px-5 md:px-10 py-16">

  {/* Heading */}
  <div className="text-center mb-10">
    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
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
        key={product.id}
        className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 items-center hover:shadow-sm transition"
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
          <div className="flex items-center justify-between">
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
          </div>
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

<ProductsShowcase />
<LiveCommunityHub />
<OurStorySection />
    </div>
  );
}