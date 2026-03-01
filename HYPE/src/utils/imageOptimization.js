/**
 * Image optimization utilities for better performance
 */

/**
 * Lazy load images when they enter viewport
 * @param {string} src - Image source URL
 * @param {Function} onLoad - Callback when image loads
 * @returns {Promise} Promise that resolves when image is loaded
 */
export const lazyLoadImage = (src, onLoad) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      if (onLoad) onLoad(img);
      resolve(img);
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };
    
    // Start loading
    img.src = src;
  });
};

/**
 * Preload critical images
 * @param {string[]} imageUrls - Array of image URLs to preload
 * @returns {Promise} Promise that resolves when all images are loaded
 */
export const preloadImages = (imageUrls) => {
  const loadPromises = imageUrls.map(url => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null); // Continue even if one fails
      img.src = url;
    });
  });
  
  return Promise.all(loadPromises);
};

/**
 * Convert PNG to WebP format recommendations
 * Recommended sizes:
 * - Hero images: 1920x1080 (desktop), 768x1024 (tablet), 375x667 (mobile)
 * - Product images: 800x800
 * - Icons: 64x64
 * 
 * Use WebP with fallback:
 * <picture>
 *   <source srcset="image.webp" type="image/webp">
 *   <img src="image.png" alt="Description">
 * </picture>
 */

/**
 * Get optimized image dimensions based on breakpoint
 * @param {string} breakpoint - 'mobile', 'tablet', or 'desktop'
 * @param {string} type - 'hero', 'product', 'icon'
 * @returns {Object} Object with width and height recommendations
 */
export const getOptimalImageSize = (breakpoint, type = 'product') => {
  const sizes = {
    hero: {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1920, height: 1080 },
    },
    product: {
      mobile: { width: 400, height: 400 },
      tablet: { width: 600, height: 600 },
      desktop: { width: 800, height: 800 },
    },
    icon: {
      mobile: { width: 32, height: 32 },
      tablet: { width: 48, height: 48 },
      desktop: { width: 64, height: 64 },
    },
  };
  
  return sizes[type]?.[breakpoint] || sizes.product[breakpoint];
};

/**
 * Add loading="lazy" attribute to images for native lazy loading
 * Modern browsers support this natively
 */
export const addLazyLoading = (imgElement) => {
  if (imgElement && 'loading' in HTMLImageElement.prototype) {
    imgElement.loading = 'lazy';
  }
};

/**
 * Create responsive image srcset
 * @param {string} baseUrl - Base image URL
 * @param {Array} widths - Array of widths for srcset
 * @returns {string} srcset string
 */
export const createSrcSet = (baseUrl, widths = [375, 768, 1024, 1920]) => {
  return widths.map(width => `${baseUrl}?w=${width} ${width}w`).join(', ');
};

