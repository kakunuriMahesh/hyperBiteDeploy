import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const products = [
  { id: 0, name: "Millet Matrix", img: "/assets/Millet_pack.webp", glow: "rgba(34, 197, 94, 0.5)" }, 
  { id: 1, name: "Power Pulse", img: "/assets/Power_pack.webp", glow: "rgba(249, 115, 22, 0.5)" },  
  { id: 2, name: "Oat Octane", img: "/assets/Oat_Pack.webp", glow: "rgba(20, 184, 166, 0.5)" },   
  { id: 3, name: "Cashew Charge", img: "/assets/Cashew_pack.webp", glow: "rgba(255, 255, 255, 0.3)" }, 
  { id: 4, name: "Seed Boost", img: "/assets/Seed_pack.webp", glow: "rgba(168, 85, 247, 0.5)" },   
];

const ActiveHyper = () => {
  const sectionRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(2);

  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 1024px)",
      isMobile: "(max-width: 1023px)",
    }, (context) => {
      let { isDesktop } = context.conditions;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        }
      });

      // 1. Entrance & Clean Fan Alignment
      tl.from(".product-pack", { 
        y: 50, 
        opacity: 0, 
        stagger: 0.1, 
        duration: 1, 
        ease: "power4.out" 
      })
      .to(".pack-0", { 
        xPercent: isDesktop ? -150 : -70, 
        yPercent: isDesktop ? 10 : -35, 
        rotate: -15 
      }, "fan")
      .to(".pack-1", { 
        xPercent: isDesktop ? -75 : -35, 
        yPercent: isDesktop ? 20 : -10, 
        rotate: -8 
      }, "fan")
      .to(".pack-2", { 
        xPercent: 0, 
        yPercent: isDesktop ? 0 : 25, 
        rotate: 0, 
        scale: 1.1, 
        zIndex: 50 
      }, "fan")
      .to(".pack-3", { 
        xPercent: isDesktop ? 75 : 35, 
        yPercent: isDesktop ? 20 : -10, 
        rotate: 8 
      }, "fan")
      .to(".pack-4", { 
        xPercent: isDesktop ? 150 : 70, 
        yPercent: isDesktop ? 10 : -35, 
        rotate: 15 
      }, "fan");

      // 2. Button Auto-Shine
      tl.to(".btn-shine", {
        x: "400%",
        duration: 1.8,
        ease: "power2.inOut"
      }, "-=0.2");

      // 3. Ultra-Smooth Floating
      gsap.to(".product-pack", {
        y: "+=10",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { amount: 1, from: "center" }
      });
    });

    return () => mm.revert();
  }, []);

  const handlePackClick = (id) => {
    setActiveId(id);
    
    // Smooth Bring to Front (No Blur)
    gsap.to(`.pack-${id}`, {
      scale: 1.2,
      zIndex: 100,
      filter: "brightness(1.1)",
      duration: 0.5,
      ease: "power3.out"
    });

    products.forEach((p) => {
      if (p.id !== id) {
        gsap.to(`.pack-${p.id}`, {
          scale: 1,
          zIndex: 10 + p.id,
          filter: "brightness(0.9)", // Just a tiny dim, no blur
          duration: 0.5,
          ease: "power3.out"
        });
      }
    });
  };

  const triggerHoverShine = () => {
    gsap.fromTo(".btn-shine", 
      { x: "-150%" }, 
      { x: "400%", duration: 1.2, ease: "power2.inOut" }
    );
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#fff] flex flex-col items-center overflow-hidden">
      
      {/* Background Aura */}
      <div 
        className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] md:w-[60vw] md:h-[60vw] rounded-full blur-[140px] transition-all duration-1000 opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #d1d5db 0%, transparent 70%)' }}
      />

      {/* Heading - Reduced size for Mobile */}
      <div className="z-10 text-center select-none pt-12 md:pt-16 px-4">
        {/* <h2 className="text-white text-4xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]">
          NO EXCUSES.<br />
          <span className="text-gray-800">ONLY FUEL.</span>
        </h2> */}
  <h2 className="text-4xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] bg-gradient-to-b from-gray-700 to-gray-900 bg-clip-text text-transparent">
  NO EXCUSES.<br />
  <span className="bg-gradient-to-b from-gray-700 to-gray-900 bg-clip-text text-transparent">
    ONLY FUEL.
  </span>
</h2>
      </div>

      {/* Arrangement Container - Uses flex-grow to stay away from button */}
      <div className="relative flex-grow w-full max-w-[1200px] flex items-center justify-center min-h-[350px] md:min-h-[500px]">
        {products.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handlePackClick(item.id)}
            className={`product-pack pack-${item.id} absolute w-[130px] md:w-[280px] cursor-pointer will-change-transform touch-none`}
            style={{ zIndex: activeId === item.id ? 100 : 10 + item.id }}
          >
            <div 
              className="absolute inset-0 w-full h-full scale-110 rounded-full blur-[60px] opacity-30 pointer-events-none"
              style={{ background: item.glow }}
            />
            <img 
              src={item.img} 
              alt={item.name} 
              className="w-full h-auto relative z-10 drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)]"
            />
          </div>
        ))}
      </div>

      {/* Glowing Button Section - Guaranteed Spacing */}
      <div className="z-30 w-full flex flex-col items-center py-10 md:py-16 px-6 border-t border-gray-200/60">
        <button 
          onClick={()=>navigate("/products")}
          onMouseEnter={triggerHoverShine}
          className="relative group overflow-hidden cursor-pointer w-fit max-w-[280px] md:max-w-[350px] py-2 md:py-4 rounded-2xl bg-white border-2 border-gray-200
                     shadow-[0_0_25px_rgba(0,0,0,0.04)] hover:shadow-[0_0_50px_rgba(0,0,0,0.1)] 
                     hover:border-gray-300 transition-all duration-500 active:scale-95"
        >
          <span className="relative z-10 bg-gradient-to-b from-gray-700 to-gray-900 bg-clip-text text-transparent text-sm md:text-xl font-black tracking-[0.15em] uppercase px-2 md:px-4 block">
            [ Activate Hyperbite ]
          </span>
          
          {/* High-Contrast Shine */}
          <div className="btn-shine absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-gray-300/40 to-transparent skew-x-[-25deg] pointer-events-none" />
          
          {/* Constant Inner Glow */}
          <div className="absolute inset-0 bg-gray-900/5 animate-pulse" />
        </button>
        
        {/* <p className="text-gray-600 text-[10px] md:text-xs tracking-[0.4em] uppercase mt-6 font-bold opacity-60">
          *Subscription & Starter Kits Available*
        </p> */}
      </div>

    </section>
  );
};

export default ActiveHyper;