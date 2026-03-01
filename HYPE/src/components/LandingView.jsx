import React, { useState } from "react";
import { productDetails } from "../config/productDetails";
import { formatProductMessage } from "../utils/whatsapp";
import { sendWhatsAppMessage } from "../utils/whatsapp";
import { FaPlus, FaMinus } from "react-icons/fa";

export default function LandingView({ onEnterPremiumMode, onOpenDetails, breakpoint }) {
  const products = Object.values(productDetails);
  const [quantities, setQuantities] = useState({});

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
    <div
    style={
        {
        paddingTop: '70px',
    }
        
    }
     className="bg-gradient-to-b from-amber-50 to-white min-h-screen">
      {/* Hero / Welcome */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
          Highly nutritious & Naturally energizing Snack for your daily boost.
          <br />
          <span className="text-emerald-700 md:text-md text-2xl">Fresh • Natural</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto mb-10">
          Handpicked quality nuts, dates and seeds — ready to enjoy now.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <button
            onClick={() => window.scrollTo({ top: window.innerHeight - 100, behavior: "smooth" })}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-md transition transform hover:scale-105"
          >
            Shop Now
          </button>

          <button
            onClick={onEnterPremiumMode}
            className="bg-white border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 px-10 py-4 rounded-full text-lg font-semibold transition"
          >
            Future Collections →
          </button>
        </div>
      </div>

      {/* Ready products grid */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 pb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Available Now – Ready to Deliver
        </h2>

        <div
          className={`grid gap-8 ${
            breakpoint === "mobile"
              ? "grid-cols-1"
              : breakpoint === "tablet"
              ? "grid-cols-2"
              : "grid-cols-3"
          }`}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="h-64 bg-gradient-to-br from-amber-50 to-emerald-50/30 flex items-center justify-center p-8">
                <img
                  src={product.packImg}
                  alt={product.name}
                  className="max-h-full object-contain"
                />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">{product.description}</p>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-3xl font-bold text-emerald-700">
                    ₹{product.price.split(" ")[0]}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-start gap-4 mb-6">
                  <button
                    onClick={() => handleDecreaseQuantity(product.id)}
                    className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition"
                  >
                    <FaMinus size={14} className="text-gray-700" />
                  </button>
                  <span className="text-2xl font-bold text-gray-800 w-12 text-center">
                    {getQuantity(product.id)}
                  </span>
                  <button
                    onClick={() => handleIncreaseQuantity(product.id)}
                    className="w-10 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center transition"
                  >
                    <FaPlus size={14} className="text-white" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    // FIXME: Changed from View & Buy to Order through WhatsApp
                    const message = formatProductMessage({...product, quantity: getQuantity(product.id)});
                    sendWhatsAppMessage(message);
                    // Reset quantity after order
                    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold transition"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}