// import React, { forwardRef, useEffect, useState } from "react";
// import { productConfigs } from "../config/productConfig";
// import DatesTimeline from "./DatesTimeline";
// import NutsLayout from "./NutsLayout";
// import SeedsLayout from "./SeedsLayout";

// const HeroBanner = forwardRef(
//   ({ productType = "nuts", onOpenDetails }, ref) => {
//     const [breakpoint, setBreakpoint] = useState("desktop");

//     // Get product configuration
//     const productConfig = productConfigs[productType] || productConfigs.nuts;

//     const isDates = productType === "dates";

//     useEffect(() => {
//       const updateBreakpoint = () => {
//         const viewportWidth = window.innerWidth;
//         let newBreakpoint = "desktop";

//         if (viewportWidth < 768) {
//           newBreakpoint = "mobile";
//         } else if (viewportWidth < 1024) {
//           newBreakpoint = "tablet";
//         } else {
//           newBreakpoint = "desktop";
//         }

//         setBreakpoint(newBreakpoint);
//       };

//       updateBreakpoint();
//       window.addEventListener("resize", updateBreakpoint);
//       return () => window.removeEventListener("resize", updateBreakpoint);
//     }, []);


//     return (
//         <div
//           ref={ref}
//           className="bg-white w-full relative"
//           style={{ overflowX: "hidden", overflowY: "auto", paddingTop: "70px" }}
//         >
//           {isDates ? (
//             <DatesTimeline
//               productConfig={productConfig}
//               onOpenDetails={onOpenDetails}
//               breakpoint={breakpoint}
//             />
//           ) : productType === "seeds" ? (
//             <SeedsLayout
//               productConfig={productConfig}
//               breakpoint={breakpoint}
//               onOpenDetails={onOpenDetails}
//             />
//           ) : (
//             <NutsLayout
//               productConfig={productConfig}
//               breakpoint={breakpoint}
//               onOpenDetails={onOpenDetails}
//             />
//           )}
//         </div>
//     );
//   }
// );

// HeroBanner.displayName = "HeroBanner";

// export default HeroBanner;

import React, { forwardRef, useEffect, useState } from "react";
import { productDetails } from "../config/productDetails";
import { productConfigs } from "../config/productConfig";

// Import your special layouts
import DatesTimeline from "./DatesTimeline";
import NutsLayout from "./NutsLayout";
import SeedsLayout from "./SeedsLayout";

const HeroBanner = forwardRef(
  ({ productType, onOpenDetails }, ref) => {
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

    // If productType is provided → show premium/future layout
    if (productType) {
      const productConfig = productConfigs[productType] || productConfigs.nuts;

      return (
        <div
          ref={ref}
          className="bg-white w-full relative"
          style={{ overflowX: "hidden", paddingTop: "70px" }}
        >
          {productType === "dates" ? (
            <DatesTimeline
              productConfig={productConfig}
              onOpenDetails={onOpenDetails}
              breakpoint={breakpoint}
            />
          ) : productType === "seeds" ? (
            <SeedsLayout
              productConfig={productConfig}
              breakpoint={breakpoint}
              onOpenDetails={onOpenDetails}
            />
          ) : (
            <NutsLayout
              productConfig={productConfig}
              breakpoint={breakpoint}
              onOpenDetails={onOpenDetails}
            />
          )}
        </div>
      );
    }

    // Default: Landing view with ready-to-deliver products
    const products = Object.values(productDetails);

    return (
      <div
        ref={ref}
        className="bg-gradient-to-b from-amber-50 to-white w-full relative"
        style={{
          overflowX: "hidden",
          paddingTop: "80px",
          paddingBottom: "60px",
        }}
      >
        {/* Hero Intro */}
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 text-center">
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 leading-tight">
              Premium Dry Fruits & Seeds
              <br />
              <span className="text-emerald-700">Naturally Good, Delivered Fresh</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Discover our handpicked collection of high-quality nuts, dates, and seeds — 
              sourced responsibly, packed with nutrition, and ready to enjoy today.
            </p>

            <button
              onClick={() => window.scrollTo({ top: window.innerHeight - 100, behavior: "smooth" })}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-10 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Explore Products ↓
            </button>
          </div>
        </div>

        {/* Ready-to-Deliver Products Grid */}
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 mt-16">
          <h2
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            Our Fresh Collection – Ready to Deliver
          </h2>

          <p
            className="text-center text-gray-600 text-lg mb-12 max-w-3xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            Carefully selected premium products available now. Rich in nutrients and perfect for daily wellness.
          </p>

          <div
            className={`grid gap-8 ${
              breakpoint === "mobile"
                ? "grid-cols-1"
                : breakpoint === "tablet"
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 animate-fade-in-up"
                style={{ animationDelay: `${1 + index * 0.2}s` }}
              >
                <div className="h-56 md:h-64 bg-gradient-to-br from-amber-50 to-emerald-50 flex items-center justify-center p-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full object-contain drop-shadow-xl transition-transform duration-700 hover:scale-110"
                  />
                </div>

                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{product.name}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">{product.description}</p>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-bold text-emerald-700">
                      ₹{product.price.split(" ")[0]}
                      <span className="text-lg font-normal text-gray-500"> / unit</span>
                    </span>
                    {product.reviewCount > 0 && (
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-medium">
                          {product.reviews?.[0]?.rating || 4.8} ({product.reviewCount})
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenDetails?.(product)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl transition duration-300 transform hover:scale-[1.02]"
                  >
                    View Details & Customize
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fadeInUp 1s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    );
  }
);

HeroBanner.displayName = "HeroBanner";

export default HeroBanner;