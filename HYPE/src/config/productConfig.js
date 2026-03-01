// Product configurations for different product types
export const productConfigs = {
  nuts: {
    id: 'nuts',
    name: 'Roasted Nuts Mix',
    heading1: 'Snack Happy with Our Roasted Nuts Mix!',
    paragraph1: 'Indulge in the ultimate snack experience with our Roasted Nuts Mix! A perfect blend of crunchy, flavorful almonds, cashews, peanuts, and hazelnuts, roasted to perfection for a satisfying, wholesome treat. It’s the ideal snack for any time of day – at home, in the office, or on-the-go!',
    heading2: 'Why You’ll Love It',
    paragraph2: 'Packed with protein, healthy fats, and tons of flavor, our Roasted Nuts Mix is the perfect balance of taste and nutrition. Each bite offers the perfect crunch and a natural, savory taste that will keep you coming back for more. It’s the snack that’s good for you and delicious too!',
    quote: '“Indulge in the ultimate snack experience with our Roasted Nuts Mix!”',
    // Image assets for this product
    images: {
      pumpkinseed1: '/assets/pumpkinseed.webp',
      wallnut1: '/assets/almond.png',
      sunflowerseed1: '/assets/cashew.png',
      dateorange1: '/assets/sunflowerseed.webp',
      dateorange2: '/assets/sunflowerseed.webp',
      sunflowershell: '/assets/sunflowershell.webp',
      sunflowerseed2: '/assets/cashew.png',
      pumpkinseed2: '/assets/pumpkinseed.webp',
      date: '/assets/date.webp',
      wallnutCenter: '/assets/almond.png',
      openCover: '/assets/openCover.png',
      closeCover: '/assets/closeCover.png',
    },
    vector: '/assets/Vector 2.png',
    // Animation configuration - original nuts animation (scattered to left cluster)
    animations: {
      rotationSpeeds: {
        pumpkinseed1: 360,
        wallnut1: -270,
        sunflowerseed1: 450,
        dateorange1: -320,
        dateorange2: 380,
        sunflowershell: -400,
        sunflowerseed2: 300,
        pumpkinseed2: -350,
        date: 280,
        wallnutCenter: -290,
      },
      dateSpeedMultiplier: 1.5, // Dates animate faster
    },
  },
  dates: {
    id: 'dates',
    name: 'Dates',
    heading1: 'A Perfect Blend of Sweetness and Nutty Flavor',
    paragraph1: 'Our premium dates are carefully selected and filled with rich pista paste and finely shredded coconut, creating a delicious balance of natural sweetness and creamy nuttiness. The soft, chewy date pairs beautifully with the smooth pistachio filling and subtle coconut texture, offering a satisfying bite every time.',
    heading2: 'A Wholesome and Energizing Treat',
    paragraph2: 'Free from refined sugar and artificial additives, these stuffed dates are a naturally nourishing snack. Packed with fiber and energy from dates, healthy fats from coconut, and the rich goodness of pista, they are perfect for mindful indulgence, gifting, or enjoying as a healthy sweet treat anytime.',
    images: {
      dot: '/assets/dot.svg',
      date1: '/assets/date.webp',
      date2: '/assets/date.webp',
      date3: '/assets/date.webp',
      date4: '/assets/date.webp',
    },
    vector: null,
    animations: {}, // Not used for the dates timeline
  },
  seeds: {
    id: 'seeds',
    name: 'Seeds',
    heading1: 'Nutritious Seeds Collection',
    paragraph1: 'Explore our premium selection of seeds, each packed with protein, fiber, and essential vitamins to support your wellness journey.',
    heading2: 'Power of Seeds',
    paragraph2: 'From sunflower to pumpkin seeds, our collection offers diverse flavors and nutritional benefits for every health-conscious individual.',
    images: {
      pumpkinseed1: '/assets/pumpkinseed.webp',
      wallnut1: '/assets/sunflowerseed.webp',
      sunflowerseed1: '/assets/sunflowerseed.webp',
      dateorange1: '/assets/sunflowershell.webp',
      dateorange2: '/assets/sunflowerseed.webp',
      sunflowershell: '/assets/sunflowershell.webp',
      sunflowerseed2: '/assets/sunflowerseed.webp',
      pumpkinseed2: '/assets/pumpkinseed.webp',
      date: '/assets/sunflowerseed.webp',
      wallnutCenter: '/assets/sunflowerseed.webp',
      vector8: '/assets/Vector-8.svg',
      vector7: '/assets/Vector-7.svg',
      sunflowerseed: '/assets/sunflowerseed.webp',
      badham: '/assets/badham.png',
      kaju: '/assets/kaju.png',
    },
    vector: '/assets/Vector 2.png',
    // Animation configuration - Seeds form a vertical cascade pattern (center)
    animations: {
      rotationSpeeds: {
        pumpkinseed1: 280,
        wallnut1: -310,
        sunflowerseed1: 340,
        dateorange1: -290,
        dateorange2: 370,
        sunflowershell: -330,
        sunflowerseed2: 300,
        pumpkinseed2: -360,
        date: 320,
        wallnutCenter: -280,
      },
      dateSpeedMultiplier: 1.3, // Medium speed for seeds
    },
  },
};

// Animation position generators for different products
export const getAnimationPositions = (productType, breakpoint, viewportHeight = null) => {
  const isMobile = breakpoint === 'mobile';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = breakpoint === 'desktop';
  
  // Get viewport height for mobile/tablet calculations
  const vh = viewportHeight || (typeof window !== 'undefined' ? window.innerHeight : (isMobile ? 750 : 1024));

  if (productType === 'nuts') {
    // Original nuts animation - scattered to left cluster
    if (isMobile) {
      // Mobile: 3 sections of 100vh each
      // Section 1: 0-100vh, Quote: 100vh-200vh, Section 2: 200vh-300vh
      const section1End = vh; // 100vh
      const section2Start = vh * 2; // 200vh
      const section2End = vh * 3; // 300vh
      
      return {  
        initial: {
          pumpkinseed1: { x: 0, y: 78, rotation: 25, width: 57, height: 56 },
          wallnut1: { x: 130, y: 15, rotation: -25, width: 77, height: 135 },
          sunflowerseed1: { x: 321, y: 494, rotation: 35, width: 50, height: 52 },
          dateorange1: { x: 290, y: 100, rotation: -20, width: 58, height: 97 },
          dateorange2: { x: 321, y: 966, rotation: 30, width: 51, height: 62 },
          sunflowershell: { x: 267, y: 231, rotation: -25, width: 75, height: 128 },
          sunflowerseed2: { x: 0, y: 541, rotation: 40, width: 64, height: 91 },
          pumpkinseed2: { x:151, y: 455, rotation: -30, width: 66, height: 72 },
          date: { x: 95, y: 800, rotation: 20, width: 67, height: 85 },
          wallnutCenter: { x: 88, y: 599, rotation: -10, width: 86, height: 85 },
          vector: { x: 0, y: 0, rotation: 0, width: 502, height: 874 },
        },
        // final: {
        //   // Final positions in Section 2 (200vh-300vh), positioned near bottom of section 2
        //   pumpkinseed1: { x: 150, y: section2Start + 280, rotation: 15, width: 78, height: 90 },
        //   wallnut1: { x: 100, y: section2Start + 278, rotation: -20, width: 76, height: 91 },
        //   sunflowerseed1: { x: 105, y: section2Start + 294, rotation: 25, width: 59, height: 84 },
        //   sunflowershell: { x: 120, y: section2Start + 269, rotation: -25, width: 73, height: 101 },
        //   sunflowerseed2: { x: 135, y: section2Start + 289, rotation: 20, width: 70, height: 74 },
        //   pumpkinseed2: { x: 200, y: section2Start + 298, rotation: -30, width: 69, height: 64 },
        //   wallnutCenter: { x: 170, y: section2Start + 290, rotation: -10, width: 68, height: 72 },
        //   dateorange1: { x: 0, y: section2Start + 160, rotation: -15, width: 62, height: 73 },
        //   dateorange2: { x: 350, y: section2Start + 380, rotation: 30, width: 70, height: 102 },
        //   date: { x: 0, y: section2Start + 420, rotation: 10, width: 49, height: 105 },
        //   vector: { 
        //     x: 0 , 
        //     y: 1269 , 
        //     rotation: 0, 
        //     width: 108 , 
        //     height: 103 
        //   },
        // },
        final: {
          pumpkinseed1: { x: 150, y: section2Start + 280, rotation: 15, width: 0, height: 0 },
          wallnut1: { x: 100, y: section2Start + 278, rotation: -20, width: 0, height: 0 },
          sunflowerseed1: { x: 105, y: section2Start + 294, rotation: 25, width: 0, height: 0 },
          sunflowershell: { x: 120, y: section2Start + 269, rotation: -25, width: 0, height: 0 },
          sunflowerseed2: { x: 135, y: section2Start + 289, rotation: 20, width: 0, height: 0 },
          pumpkinseed2: { x: 200, y: section2Start + 298, rotation: -30, width: 0, height: 0 },
          wallnutCenter: { x: 170, y: section2Start + 290, rotation: -10, width: 0, height: 0 },
          dateorange1: { x: 0, y: section2Start + 160, rotation: -15, width: 62, height: 73 },
          dateorange2: { x: 310, y: section2Start + 380, rotation: 30, width: 50, height: 40 },
          date: { x: 0, y: section2Start + 420, rotation: 10, width: 49, height: 105 },
          vector: { x: 0, y: 1269, rotation: 0, width: 0, height: 0 }
        },
        
      };
    } else if (isTablet) {
      // Tablet: 3 sections of 100vh each
      // Section 1: 0-100vh, Quote: 100vh-200vh, Section 2: 200vh-300vh
      const section1End = vh; // 100vh
      const section2Start = vh * 2; // 200vh
      const section2End = vh * 3; // 300vh
      const containerWidth = 768;
      const containerHeight = 1900;
      const clusterCenterX = 360;
      const clusterTopY = 1275;
      const endScale = 0.35;
      
      return {
        initial: {
          pumpkinseed1: { x: 20, y: 700, rotation: 25, width: 120, height: 130 },
          wallnut1: { x: 250, y: 800, rotation: -35, width: 110, height: 120 },
          sunflowerseed1: { x: 600, y: 480, rotation: 35, width: 100, height: 100 },
          dateorange1: { x: -20, y: 0, rotation: -20, width: 100, height: 230 },
          dateorange2: { x: 550, y: 900, rotation: 30, width: 130, height: 160 },
          sunflowershell: { x: 650, y: 20, rotation: -25, width: 200, height: 240 },
          sunflowerseed2: { x: 0, y: 550, rotation: 40, width: 70, height: 110 },
          pumpkinseed2: { x: 650, y: 720, rotation: -30, width: 95, height: 110 },
          date: { x: 650, y: 540, rotation: 20, width: 90, height: 170 },
          wallnutCenter: { x: 320, y: 390, rotation: -10, width: 200, height: 240 },
          vector: { x: 0, y: 0, rotation: 0, width: containerWidth, height: containerHeight },
        },
        final: {
          // Final positions in Section 2 (200vh-300vh), positioned near bottom of section 2
          pumpkinseed1: { x: 366, y: section2Start + 412, rotation: 15, width: 100, height: 120 },
          wallnut1: { x: 301, y: section2Start + 400, rotation: -20, width: 120, height: 130 },
          sunflowerseed1: { x: 253, y: section2Start + 400, rotation: 25, width: 135, height: 120 },
          sunflowershell: { x: 331, y: section2Start + 355, rotation: -25, width: 95, height: 140 },
          sunflowerseed2: { x: 444, y: section2Start + 408, rotation: 20, width: 110, height: 100 },
          pumpkinseed2: { x: 475, y: section2Start + 407, rotation: 80, width: 120, height: 95 },
          wallnutCenter: { x: 426, y: section2Start + 360, rotation: -10, width: 70, height: 100 },
          dateorange1: { x: 0, y: section2Start + 100, rotation: -15, width: 130, height: 180 },
          dateorange2: { x: 650, y: section2Start + 600, rotation: 30, width: 150, height: 140 },
          date: { x: -120, y: section2Start + 580, rotation: 10, width: 140, height: 120 },
          vector: { 
            x: 50,
            y: clusterTopY - 500,
            rotation: 0,
            width: containerWidth * 0.20,
            height: containerHeight * 0.2,
          },
        },
      };
    } else {
      // Desktop: Use viewport-based calculations like mobile/tablet
      // 3 sections of 100vh each: Section 1: 0-100vh, Quote: 100vh-200vh, Section 2: 200vh-300vh
      const section2Start = vh * 3; // 300vh - final positions are lower (for proper alignment)
      
      return {
        initial: {
          pumpkinseed1: { x: 0, y: 646, rotation: 25, width: 116, height: 132 },
          wallnut1: { x: 407, y: 660, rotation: -15, width: 109, height: 205 },
          sunflowerseed1: { x: 447, y: 121, rotation: 35, width: 81, height: 81 },
          dateorange1: { x: 0, y: 713, rotation: -20, width: 180, height: 273 },
          dateorange2: { x: 916, y: 660, rotation: 30, width: 116, height: 158 },
          sunflowershell: { x: 1109, y: 48, rotation: -25, width: 216, height: 276 },
          sunflowerseed2: { x: 0, y: 330, rotation: 40, width: 115, height: 140 },
          pumpkinseed2: { x: 1639, y: 555, rotation: -30, width: 159, height: 175 },
          date: { x: 1549, y: 908, rotation: 20, width: 149, height: 169 },
          wallnutCenter: { x: 681, y: 132, rotation: -10, width: 235, height: 279 },
          vector: { x: 0, y: 0, rotation: 0, width: 1698, height: 2946 },
        },
        // final: {
        //   // Final positions in Section 2, positioned relative to section2Start (vh * 2 = 200vh)
        //   // Animation completes at 200vh, so nuts settle here when second section becomes visible
        //   // Positions are optimized to align with second section content (above footer, no gap)
        //   pumpkinseed1: { x: 425, y: section2Start + 270, rotation: 15, width: 95, height: 129 },
        //   wallnut1: { x: 180, y: section2Start + 278, rotation: -20, width: 129, height: 132 },
        //   sunflowerseed1: { x: 286, y: section2Start + 294, rotation: 25, width: 96, height: 94 },
        //   dateorange1: { x: 0, y: section2Start + 30, rotation: -15, width: 137, height: 212 },
        //   dateorange2: { x: 859, y: section2Start + 80, rotation: 30, width: 164, height: 209 },
        //   sunflowershell: { x: 248, y: section2Start + 199, rotation: -25, width: 80, height: 160 },
        //   sunflowerseed2: { x: 277, y: section2Start + 289, rotation: 20, width: 70, height: 82 },
        //   pumpkinseed2: { x: 432, y: section2Start + 238, rotation: 40, width: 110, height: 88 },
        //   date: { x: 1289, y: section2Start + 620, rotation: 10, width: 149, height: 179 },
        //   wallnutCenter: { x: 298, y: section2Start + 190, rotation: -10, width: 108, height: 78 },
        //   vector: { 
        //     x: -550, 
        //     y: 950, 
        //     rotation: 0, 
        //     width: 598 * 0.35, 
        //     // height: 246 * 0.35 
        //   },
        // },
        final: {
          // Final positions in Section 2, positioned relative to section2Start (vh * 2 = 200vh)
          // Animation completes at 200vh, so nuts settle here when second section becomes visible
          // Positions are optimized to align with second section content (above footer, no gap)
          pumpkinseed1: { x: 425, y: section2Start + 270, rotation: 15, width: 0, height: 0 },
          wallnut1: { x: 180, y: section2Start + 278, rotation: -20, width: 0, height: 0 },
          sunflowerseed1: { x: 286, y: section2Start + 294, rotation: 25, width: 0, height: 0 },
          dateorange1: { x: 0, y: section2Start + 30, rotation: -15, width: 137, height: 212 },
          dateorange2: { x: 859, y: section2Start - 200, rotation: 30, width: 164, height: 209 },
          sunflowershell: { x: 248, y: section2Start + 199, rotation: -25, width: 0, height: 0 },
          sunflowerseed2: { x: 277, y: section2Start + 289, rotation: 20, width: 0, height: 0 },
          pumpkinseed2: { x: 432, y: section2Start + 238, rotation: 40, width: 0, height: 0 },
          date: { x: 1289, y: section2Start + 620, rotation: 10, width: 149, height: 179 },
          wallnutCenter: { x: 298, y: section2Start + 190, rotation: -10, width: 0, height: 0 },
          vector: { 
            x: -550, 
            y: 950, 
            rotation: 0, 
            width: 598 * 0.35, 
            // height: 246 * 0.35 
          },
        },
      };
    }
  }
   else if (productType === 'dates') {
    // Dates now use the dedicated path animation component; no nut positions needed.
    return { initial: {}, final: {} };
  } else if (productType === 'seeds') {
    // Seeds animation - vertical cascade pattern in center
    if (isMobile) {
      // Mobile: 3 sections of 100vh each
      const section2Start = vh * 2; // 200vh
      
      return {
        initial: {
          pumpkinseed1: { x: 150, y: 0, rotation: 20, width: 95, height: 95 },
          wallnut1: { x: 200, y: 200, rotation: -25, width: 115, height: 170 },
          sunflowerseed1: { x: 100, y: 400, rotation: 30, width: 78, height: 70 },
          dateorange1: { x: 250, y: 600, rotation: -20, width: 96, height: 185 },
          dateorange2: { x: 50, y: 800, rotation: 25, width: 79, height: 50 },
          sunflowershell: { x: 180, y: 1000, rotation: -30, width: 133, height: 225 },
          sunflowerseed2: { x: 120, y: 1200, rotation: 35, width: 122, height: 178 },
          pumpkinseed2: { x: 220, y: 300, rotation: -15, width: 114, height: 90 },
          date: { x: 80, y: 500, rotation: 22, width: 115, height: 162 },
          wallnutCenter: { x: 160, y: 700, rotation: -12, width: 144, height: 162 },
        },
        final: {
          // Final positions in Section 2 (200vh-300vh), center vertical cascade
          pumpkinseed1: { x: 150, y: section2Start + 100, rotation: 12, width: 76, height: 88 },
          wallnut1: { x: 145, y: section2Start + 120, rotation: -18, width: 74, height: 89 },
          sunflowerseed1: { x: 155, y: section2Start + 140, rotation: 22, width: 57, height: 82 },
          sunflowershell: { x: 140, y: section2Start + 110, rotation: -22, width: 71, height: 99 },
          sunflowerseed2: { x: 150, y: section2Start + 135, rotation: 18, width: 68, height: 72 },
          pumpkinseed2: { x: 160, y: section2Start + 145, rotation: -28, width: 67, height: 62 },
          wallnutCenter: { x: 155, y: section2Start + 125, rotation: -8, width: 66, height: 70 },
          dateorange1: { x: 0, y: section2Start - 290, rotation: -15, width: 62, height: 73 },
          dateorange2: { x: 320, y: section2Start + 230, rotation: 30, width: 70, height: 52 },
          date: { x: 0, y: section2Start + 300, rotation: 10, width: 49, height: 35 },
        },
      };
    } else if (isTablet) {
      // Tablet: 3 sections of 100vh each
      const section2Start = vh * 2; // 200vh
      
      return {
        initial: {
          pumpkinseed1: { x: 300, y: 0, rotation: 20, width: 118, height: 128 },
          wallnut1: { x: 400, y: 200, rotation: -25, width: 108, height: 118 },
          sunflowerseed1: { x: 250, y: 400, rotation: 30, width: 98, height: 98 },
          dateorange1: { x: 500, y: 600, rotation: -20, width: 98, height: 228 },
          dateorange2: { x: 100, y: 800, rotation: 25, width: 128, height: 158 },
          sunflowershell: { x: 350, y: 1000, rotation: -30, width: 198, height: 238 },
          sunflowerseed2: { x: 200, y: 1200, rotation: 35, width: 68, height: 108 },
          pumpkinseed2: { x: 450, y: 300, rotation: -15, width: 93, height: 108 },
          date: { x: 150, y: 500, rotation: 22, width: 88, height: 168 },
          wallnutCenter: { x: 320, y: 700, rotation: -12, width: 198, height: 238 },
        },
        final: {
          // Final positions in Section 2 (200vh-300vh), center vertical cascade
          pumpkinseed1: { x: 350, y: section2Start + 276, rotation: 12, width: 98, height: 118 },
          wallnut1: { x: 345, y: section2Start + 296, rotation: -18, width: 118, height: 128 },
          sunflowerseed1: { x: 355, y: section2Start + 316, rotation: 22, width: 53, height: 83 },
          sunflowershell: { x: 340, y: section2Start + 246, rotation: -22, width: 93, height: 138 },
          sunflowerseed2: { x: 350, y: section2Start + 311, rotation: 18, width: 88, height: 98 },
          pumpkinseed2: { x: 360, y: section2Start + 341, rotation: -28, width: 118, height: 93 },
          wallnutCenter: { x: 355, y: section2Start + 311, rotation: -8, width: 108, height: 98 },
          dateorange1: { x: 0, y: section2Start + 376, rotation: -15, width: 130, height: 180 },
          dateorange2: { x: 550, y: section2Start + 376, rotation: 30, width: 150, height: 140 },
          date: { x: 0, y: section2Start + 356, rotation: 10, width: 140, height: 110 },
        },
      };
    } else {
      // Desktop: Use viewport-based calculations like mobile/tablet
      // 3 sections of 100vh each: Section 1: 0-100vh, Quote: 100vh-200vh, Section 2: 200vh-300vh
      const section2Start = vh * 3; // 300vh - final positions are lower (for proper alignment)
      
      return {
        initial: {
          pumpkinseed1: { x: 700, y: 0, rotation: 20, width: 214, height: 230 },
          wallnut1: { x: 900, y: 200, rotation: -25, width: 207, height: 203 },
          sunflowerseed1: { x: 600, y: 400, rotation: 30, width: 179, height: 162 },
          dateorange1: { x: 1000, y: 600, rotation: -20, width: 178, height: 371 },
          dateorange2: { x: 200, y: 800, rotation: 25, width: 214, height: 256 },
          sunflowershell: { x: 800, y: 1000, rotation: -30, width: 314, height: 374 },
          sunflowerseed2: { x: 500, y: 1200, rotation: 35, width: 113, height: 179 },
          pumpkinseed2: { x: 950, y: 300, rotation: -15, width: 157, height: 173 },
          date: { x: 400, y: 500, rotation: 22, width: 147, height: 267 },
          wallnutCenter: { x: 750, y: 700, rotation: -12, width: 333, height: 377 },
        },
        final: {
          // Final positions in Section 2, center vertical cascade relative to section2Start (vh * 2 = 200vh)
          // Animation completes at 200vh, so nuts settle here when second section becomes visible
          // Positions are optimized to align with second section content (above footer, no gap)
          pumpkinseed1: { x: 750, y: section2Start + 40, rotation: 12, width: 193, height: 227 },
          wallnut1: { x: 745, y: section2Start + 60, rotation: -18, width: 227, height: 230 },
          sunflowerseed1: { x: 755, y: section2Start + 80, rotation: 22, width: 104, height: 152 },
          sunflowershell: { x: 740, y: section2Start + 50, rotation: -22, width: 178, height: 258 },
          sunflowerseed2: { x: 750, y: section2Start + 75, rotation: 18, width: 168, height: 180 },
          pumpkinseed2: { x: 760, y: section2Start + 85, rotation: -28, width: 208, height: 153 },
          wallnutCenter: { x: 755, y: section2Start + 65, rotation: -8, width: 206, height: 176 },
          dateorange1: { x: 0, y: section2Start - 90, rotation: -15, width: 237, height: 312 },
          dateorange2: { x: 859, y: section2Start + 170, rotation: 30, width: 264, height: 239 },
          date: { x: 1289, y: section2Start + 240, rotation: 10, width: 249, height: 179 },
        },
      };
    }
  }

  // Fallback to nuts animation
  return getAnimationPositions('nuts', breakpoint);
};

