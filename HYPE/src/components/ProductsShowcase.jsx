import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    packname: "Seed Boost",
    selectedpoint: "The Micronutrient Powerhouse",
    desc: "A savory, crunchy blend of Sunflower, Pumpkin, and Watermelon seeds, lightly roasted in premium ghee with a hint of cinnamon and secret spices.",
    benefit: "5g Clean Plant Protein",
    why: "Rich in Magnesium and Zinc for heart health and immunity. Cinnamon supports metabolism naturally.",
    img: "/assets/speed-boost-pack.png",
    bg: "#FFFFFF"
  },
  {
    packname: "Cashew Charge",
    selectedpoint: "The Gourmet Junk-Food Killer",
    desc: "High-quality cashews roasted in allowable ghee and seasoned with a bold Cinnamon profile.",
    benefit: "Healthy replacement for oil-soaked chips.",
    why: "Provides healthy monounsaturated fats that keep you satiated longer, killing hot cravings instantly while supporting brain health",
    img: "/assets/cashew-charge-pack.png",
    bg: "#FFFBF2"
  },
  {
    packname: "Millet Matrix",
    selectedpoint: "Ancient Grains for Modern Endurance",
    desc: "An authentic experience of ancient wisdom, combining Raagi, Sajja, Korra, and Jonnalu. Sweetened only with Raw Honey and Dates.",
    benefit: "Exceptional source of dietary fiber.",
    why: "The slow-release carbohydrates from these four millets ensure you stay full and focused for hours, maintaining gut health.",
    img: "/assets/millet-matrix-pack.png",
    bg: "#FAF5FF"
  },
  {
    packname: "Oats Octane",
    selectedpoint: "The Sustained Energy Engine",
    desc: "A high-performance mix of Rolled Oats, Sunflower & Pumpkin seeds, Roasted Peanuts and Raw Honey.",
    benefit: "Clean Energy with zero-sugar-spike.",
    why: "The combination of Beta-Glucan and healthy fats creates a time-release energy effect, perfect for long journeys.",
    img: "/assets/oats-octane-pack.png",
    bg: "#F0F9FF"
  },
  {
    packname: "Power Chunk",
    selectedpoint: "The High-Protein Recovery Bite",
    desc: "A potent blend of Dates, Nuts, Hemp Protein powder and Dark Chocolate, finished with a refreshing Orange zest.",
    benefit: "Stops junk-food hunting in its tracks.",
    why: "Hemp protein contains all nine essential amino acids. Combined with dark chocolate and dates, it’s the ultimate recovery snack.",
    img: "/assets/power-Chunk-pack.png",
    bg: "#FFF5F5"
  }
];

export default function HyperBiteStackEngine() {
  const mainRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".card-wrapper");
      
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: mainRef.current,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });

        if (i < cards.length - 1) {
          gsap.to(card.querySelector(".inner-card"), {
            scale: 0.94,
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
            }
          });
        }
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative w-full bg-[#f8f9fb]">
      
      {/* Intro Section - Reduced height for mobile */}
      {/* <div className="h-[30vh] md:h-[40vh] flex flex-col items-center justify-center px-6">
        <h2 className="text-3xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter text-center leading-none">
          Engineered <br/> for Power
        </h2>
      </div> */}
            {/* HEADER */}
      <div className="h-[30vh] md:h-[40vh] flex flex-col items-center justify-center px-6">
        <h2 className="text-3xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter text-center leading-none">
          Designed for Everyday Power
        </h2>
        <p className="text-md text-center md:text-2xl text-gray-500 leading-relaxed font-medium">
          Clean ingredients. Real benefits. No compromises.
        </p>
      </div>

      <div className="flex flex-col items-center w-full">
        {products.map((item, index) => (
          <div 
            key={index} 
            className="card-wrapper w-full h-screen flex items-center justify-center p-3 sm:p-6"
            style={{ zIndex: index + 1 }}
          >
            <div 
              className="inner-card relative w-full max-w-6xl h-[85vh] md:h-[80vh] rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-white flex flex-col md:flex-row items-center overflow-hidden p-5 md:p-16 gap-4 md:gap-10"
              style={{ backgroundColor: item.bg }}
            >
              {/* Left: Product Image - Smaller on Mobile */}
              <div className="w-full md:w-1/2 flex justify-center items-center h-[30%] md:h-full">
                <img 
                  src={item.img} 
                  alt={item.packname} 
                  className="w-auto h-full max-h-[180px] md:max-h-[450px] object-contain drop-shadow-xl" 
                />
              </div>

              {/* Right: Content - Tightened for Mobile */}
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                {/* <p className="text-blue-600 font-black text-[10px] md:text-sm tracking-[0.2em] uppercase mb-1 md:mb-2">
                  HyperBite No. 0{index + 1}
                </p> */}
                <h2 className="text-2xl md:text-6xl font-black text-gray-950 leading-[0.9] uppercase tracking-tighter mb-2 md:mb-4">
                  {item.packname}
                </h2>
                
                <p className="text-sm md:text-xl font-bold text-gray-800 mb-2 md:mb-4 italic leading-tight">
                  {item.selectedpoint}
                </p>

                <p className="text-gray-600 text-[11px] md:text-base leading-relaxed mb-4 md:mb-6 font-medium">
                  {item.desc}
                </p>

                {/* Info Pill - Smaller text */}
                <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                  <div className="bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                    <p className="text-[10px] text-gray-900 font-bold">
                      <span className="text-gray-400 font-black mr-1">BENEFIT:</span> 
                      {item.benefit}
                    </p>
                  </div>
                </div>

                {/* Why It Works Box - Reduced Padding & Font for Mobile */}
                <div className="bg-black/[0.03] p-3 md:p-6 rounded-[1rem] md:rounded-[1.5rem] border border-black/[0.05]">
                  <p className="text-[9px] md:text-[10px] text-black/30 uppercase font-black tracking-widest mb-1 md:mb-2">Why it works</p>
                  <p className="text-gray-800 text-[10px] md:text-sm leading-snug md:leading-relaxed font-semibold italic">
                    "{item.why}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Reveal */}
      <div className="h-[60vh] md:h-screen bg-white flex flex-col items-center justify-center relative z-[100] text-center px-6">
        <h2 className="text-4xl md:text-9xl font-black text-gray-900 uppercase tracking-tighter">
          Clean Bite. <br/> Big Life.
        </h2>
        <button onClick={()=>navigate("/products")} className="mt-6 md:mt-10 px-8 py-3 md:px-12 md:py-5 bg-black text-white font-bold rounded-full text-sm md:text-lg hover:scale-110 transition-transform">
          GET THE COLLECTION
        </button>
      </div>
    </div>
  );
}
// import { motion } from "framer-motion";

// const products = [
//   {
//     packname:"Seed Boost",
//     selectedpoint: "The Micronutrient Powerhouse",
//     desc: "A savory, crunchy blend of Sunflower, Pumpkin, and Watermelon seeds, lightly roasted in premium ghee with a hint of cinnamon and secret spices.",
//     benefit: "5g Clean Plant Protein",
//     why: "Rich in Magnesium and Zinc for heart health and immunity. Cinnamon supports metabolism naturally.",
//     img: "/assets/speed-boost-pack.png"
//   },
//   {
//     packname:"Cashew Charge",
//     selectedpoint: "The Gourmet Junk-Food Killer Fresh,",
//     desc: " high-quality cashews roasted in allowable ghee and seasoned with a bold Cinnamon profile.",
//     benefit: "A direct, healthy replacement for high-cholesterol, oil-soaked chips.",
//     why: "Provides healthy monounsaturated fats that keep you satiated longer, killing hot cravings instantly while supporting brain health",
//     img: "/assets/cashew-charge-pack.png"
//   },
//   {
//     packname:"Millet Matrix",
//     selectedpoint: "Ancient Grains for Modern Endurance An authentic experience of ancient wisdom,",
//     desc: " combining Raagi, Sajja, Korra, and Jonnalu. Sweetened only with Raw Honey and Dates.",
//     benefit: "An exceptional source of complex dietary fiber.",
//     why: "The slow-release carbohydrates from these four millets ensure you stay full and focused for hours, maintaining gut health and steady glucose levels.",
//     img: "/assets/millet-matrix-pack.png"
//   },
//   {
//     packname:"Oats Octane",
//     selectedpoint: "The Sustained Energy Engine",
//     desc: " A high-performance mix of Rolled Oats, Sunflower & Pumpkin seeds, Roasted Peanuts and Raw Honey.",
//     benefit: "Delivers Clean Energy with a zero-sugar-spike guarantee.",
//     why: "The combination of Beta-Glucan (from oats) and healthy fats (from peanuts/seeds) creates a time-release energy effect, making it the perfect partner for long journeys or sports.",
//     img: "/assets/oats-octane-pack.png"
//   },
//   {
//     packname:"Power Chunk",
//     selectedpoint: "The High-Protein Recovery Bite",
//     desc: " A potent blend of Dates, Nuts, Hemp Protein powder and Dark Chocolate, finished with a refreshing Orange zest.",
//     benefit: "A complete protein source that stops junk-food hunting in its tracks.",
//     why: "Hemp protein contains all nine essential amino acids. Combined with the antioxidants in dark chocolate and the natural energy of dates, it’s the ultimate post-workout or high-intensity recovery snack.",
//     img: "/assets/power-Chunk-pack.png"
//   },
//   // add 4 more
// ];

// export default function ProductsStorySection() {
//   return (
//     <div className="bg-[#f8f9fb] py-20 px-6 md:px-16 max-w-7xl mx-auto">

      // {/* HEADER */}
      // <div className="max-w-7xl text-center mb-20">
      //   <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
      //     Designed for Everyday Power
      //   </h2>
      //   <p className="text-gray-600">
      //     Clean ingredients. Real benefits. No compromises.
      //   </p>
      // </div>

//       {/* PRODUCTS */}
//       <div className="flex flex-col gap-24">

//         {products.map((item, index) => {
//           const isReverse = index % 2 !== 0;

//           return (
//             <div
//               key={index}
//               className={`flex flex-col md:flex-row items-center justify-between gap-5 ${
//                 isReverse ? "md:flex-row-reverse" : ""
//               }`}
//             >
//               {/* IMAGE */}
//               <div className={`${isReverse ? "w-full md:w-1/2 flex md:flex-row flex-col justify-center" : "w-full md:w-1/2 flex flex-col  justify-start"}`}>
//                 {!isReverse ? <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{item.packname}</h1> : <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:hidden">{item.packname}</h1>}
//                 <div
//                   className="w-full md:w-1/2 flex justify-center"
//                 >
//                   <div className="w-[260px] md:w-[320px] aspect-[3/4] overflow-hidden">
//                     <img
//                       src={item.img}
//                       alt=""
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* CONTENT */}
//               <motion.div
//                 initial={{ opacity: 0, y: 60 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 className="w-full md:w-1/2"
//               >
//                 {isReverse ? <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:block hidden">{item.packname}</h1> : null}
//                 <p className="text-gray-600 leading-7 mb-5">
//                   <span className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
//                   {item.selectedpoint + " "}
//                   </span>
//                   {item.desc}
//                 </p>

                

//                 {/* BENEFIT */}
//                 <div className="inline-block bg-green-100 text-green-700 text-sm px-4 py-1 rounded-full mb-6">
//                   {item.benefit}
//                 </div>

//                 {/* WHY */}
//                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
//                   <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">
//                     Why it works
//                   </p>
//                   <p className="text-gray-700 text-sm leading-6">
//                     {item.why}
//                   </p>
//                 </div>
//               </motion.div>
//             </div>
//           );
//         })}

//       </div>
//     </div>
//   );
// }