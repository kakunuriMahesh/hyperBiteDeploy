import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const products = [
  { 
    id: 1, 
    name: "Seed Boost", 
    img: "/assets/speed-boost-pack.png",
    bgColor: "#fdf2f2" // Soft Red/Amber
  },
  { 
    id: 2, 
    name: "Cashew Charge", 
    img: "/assets/cashew-charge-pack.png",
    bgColor: "#f0fdf4" // Soft Emerald
  },
  { 
    id: 3, 
    name: "Millet Matrix", 
    img: "/assets/millet-matrix-pack.png",
    bgColor: "#fff7ed" // Soft Orange
  },
  { 
    id: 4, 
    name: "Oats Octane", 
    img: "/assets/oats-octane-pack.png",
    bgColor: "#f5f3ff" // Soft Purple
  },
  { 
    id: 5, 
    name: "Power Chunk", 
    img: "/assets/power-Chunk-pack.png",
    bgColor: "#ecfdf5" // Soft Teal
  },
];

const HeroSection = ({ onEnterPremiumMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dimensions, setDimensions] = useState({ rx: 480, rz: 320 });
  const navigate = useNavigate();
  // 1. Responsive Radii Logic
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        rx: window.innerWidth > 768 ? 480 : 180,
        rz: window.innerWidth > 768 ? 320 : 160
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Auto Rotation Logic
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section 
      className="min-h-screen flex flex-col justify-center items-center text-center px-5 md:px-10 relative overflow-hidden transition-colors duration-1000 ease-in-out"
      // style={{ backgroundColor: products[currentIndex].bgColor }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* --- HEADER CONTENT --- */}
   <div className="max-w-4xl mx-auto z-20 relative pointer-events-none">
  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight leading-[1.15] pb-1
    text-neutral-800
    [text-shadow:0_1px_0_rgba(255,255,255,0.4)]">
    Stop Sweet-Talking Your Health. Jaggery is Still Sugar.
  </h1>

  <h2
  className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-[1.1] pb-1"
  style={{
    color: "#10b981",
    backgroundImage:
      "linear-gradient(110deg, #10b981 0%, #10b981 45%, #d1fae5 50%, #10b981 55%, #10b981 100%)",
    backgroundSize: "200% 100%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "shineOnce 1.8s ease-out forwards",
  }}
>
  We're Still Different.
</h2>

<style jsx>{`
  @keyframes shineOnce {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`}</style>
</div>
      
      {/* --- BOTTOM CONTENT & CTA --- */}
      <div className=" z-20 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4">
  
  <button
    onClick={() => navigate("/products")}
    className="
      w-full sm:w-auto
      cursor-pointer
      bg-emerald-600 hover:bg-emerald-700
      text-white
      px-5 sm:px-7
      py-2.5 sm:py-3
      text-sm sm:text-base
      font-semibold
      rounded-full
      shadow-md sm:shadow-lg
      transition
      transform hover:scale-105 active:scale-95
    "
  >
    Shop Now
  </button>

  <button
    onClick={onEnterPremiumMode}
    className="
      w-full sm:w-auto
      bg-white/80 border border-gray-300
      text-gray-800 hover:bg-white
      px-5 sm:px-7
      py-2.5 sm:py-3
      text-sm sm:text-base
      font-semibold
      rounded-full
      shadow-sm
      transition
      transform hover:scale-105 active:scale-95
    "
  >
    Future Collections →
  </button>

</div>

      {/* --- CAROUSEL STAGE --- */}
      <div 
        className="relative top-[-100px] md:top-[-150px] w-full h-[450px] md:h-[550px] flex items-center justify-center -mt-10 md:-mt-20 z-10"
        style={{ perspective: '2000px' }}
      >
        <div 
          className="relative w-full h-full flex items-center justify-center transition-transform duration-1000"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-22deg)' // Increased tilt to move front card FURTHER down
          }}
        >
          {products.map((product, i) => {
            const angle = ((i - currentIndex) * (360 / products.length)) * (Math.PI / 180) + (Math.PI / 2);
            const x = Math.cos(angle) * dimensions.rx;
            const z = Math.sin(angle) * dimensions.rz;
            
            const scale = (z + dimensions.rz) / (2 * dimensions.rz) * 0.4 + 0.65;
            const opacity = (z + dimensions.rz) / (2 * dimensions.rz) * 0.7 + 0.3;
            const isActive = i === currentIndex;

            return (
              <div
                key={product.id}
                onClick={() => setCurrentIndex(i)}
                className={`absolute w-[160px] h-[220px] md:w-[240px] md:h-[330px] rounded-xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-1000 ease-out border-4 ${
                  isActive ? '' : 'border-white/50'
                }`}
                style={{
                  transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
                  opacity: opacity,
                  zIndex: Math.round(100 + (z / 5)),
                  filter: isActive ? 'none' : 'brightness(0.7) blur(3px)'
                }}
              >
                <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                <div className={`absolute bottom-0 w-full p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="text-white text-xs md:text-sm font-bold uppercase tracking-widest">{product.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

<div className="max-w-4xl mx-auto z-20 relative top-[-100px] md:top-[-100px] pointer-events-none">
  <p className="text-base md:text-lg text-gray-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
      We stopped pretending Jaggery was the answer. It’s not. <br/>It’s just sugar with a better publicist. <br/> HyperBite is built on the uncompromising power of real ingredients like Raw Honey and Dates to fuel your life without the crash. <br/>No excuses. No compromises.
    </p>
</div>
      

      {/* --- MARQUEE (Keep as per original design) --- */}
     <div className="absolute bottom-0 left-0 w-full bg-black h-24 md:h-32 flex items-center overflow-hidden z-30">
  <div className="relative w-full flex overflow-hidden">

    {/* LEFT FADE */}
    <div className="pointer-events-none absolute left-0 top-0 h-full w-32 z-10 bg-gradient-to-r from-black to-transparent"></div>

    {/* RIGHT FADE */}
    <div className="pointer-events-none absolute right-0 top-0 h-full w-32 z-10 bg-gradient-to-l from-black to-transparent"></div>

    {/* MARQUEE TRACK */}
    <div className="flex animate-marquee whitespace-nowrap">
      
      {/* FIRST SET */}
      <div className="flex gap-16 px-10 text-white font-semibold text-3xl md:text-5xl">
        <span>0% ADDED JAGGERY</span>
        <span>0% REFINED SUGAR</span>
        <span>SWEETENED WITH RAW HONEY & DATES</span>
      </div>

      {/* DUPLICATE (IMPORTANT for seamless loop) */}
      <div className="flex gap-16 px-10 text-white font-semibold text-3xl md:text-5xl">
        <span>0% ADDED JAGGERY</span>
        <span>0% REFINED SUGAR</span>
        <span>SWEETENED WITH RAW HONEY & DATES</span>
      </div>

    </div>
  </div>
</div>

<style jsx>{`
  @keyframes marquee {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .animate-marquee {
    animation: marquee 20s linear infinite;
    width: max-content;
  }
`}</style>
      
    </section>
  );
};

export default HeroSection;