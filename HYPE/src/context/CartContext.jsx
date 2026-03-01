import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { allowedPincodes } from '../config/allowedPincodes';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Lazy initialization of state from localStorage to avoid race conditions
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  const [packItems, setPackItems] = useState(() => {
    try {
      const saved = localStorage.getItem('packs');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading packs from localStorage:', error);
      return [];
    }
  });

  const [inProgressPacks, setInProgressPacks] = useState(() => {
    try {
      const saved = localStorage.getItem('inProgressPacks');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading in-progress packs from localStorage:', error);
      return [];
    }
  });

  const [pincode, setPincode] = useState(() => {
    return localStorage.getItem('pincode') || '';
  });

  // Save cart and packs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('packs', JSON.stringify(packItems));
  }, [packItems]);

  useEffect(() => {
    localStorage.setItem('inProgressPacks', JSON.stringify(inProgressPacks));
  }, [inProgressPacks]);

  useEffect(() => {
    if (pincode) localStorage.setItem('pincode', pincode);
  }, [pincode]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.variation === product.variation
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && item.variation === product.variation
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            ...product,
            quantity: 1,
            variation: product.variation || 'default',
          },
        ];
      }
    });
  };

  const addPackToCart = (packData) => {
    setPackItems((prevItems) => {
      // Always add as a new item because each custom pack can be different
      // Generate a unique instance ID
      const instanceId = `pack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      return [
        ...prevItems,
        {
          ...packData,
          instanceId, // Unique ID for this specific added pack
          quantity: 1,
        },
      ];
    });
  };

  const startOrUpdateInProgressPack = (packData) => {
    setInProgressPacks((prev) => {
      const existing = prev.find((p) => p.packId === packData.packId);
      if (existing) {
        return prev.map((p) => (p.packId === packData.packId ? { ...p, ...packData } : p));
      }
      return [...prev, packData];
    });
  };

  const removeInProgressPack = (packId) => {
    setInProgressPacks((prev) => prev.filter((p) => p.packId !== packId));
  };

  const finalizeInProgressPack = (packId) => {
    const pack = inProgressPacks.find((p) => p.packId === packId);
    if (!pack) return;
    addPackToCart({
      packId: pack.packId,
      packName: pack.packName,
      packPrice: pack.packPrice || pack.total || 0,
      packOffPrice: pack.packOffPrice || 0,
      items: pack.items || [],
      total: pack.total || 0,
    });
    // remove from in-progress
    setInProgressPacks((prev) => prev.filter((p) => p.packId !== packId));
  };

  //FIXME: This function checks pincode validity - ensure it's called before ANY checkout or purchase action
  const ensurePincodeValid = () => {
    // If pincode already set and allowed, return true
    if (pincode && allowedPincodes.includes(pincode)) return true;
    // Return false - let the component handle modal
    return false;
  };

  //FIXME: Pincode validation - MUST be called and validated before completing any order
  const validateAndSetPincode = (code) => {
    // Convert to string and trim for safety
    const cleanCode = String(code).trim();
    //FIXME: Currently allows ANY pincode - commented out validation
    // if (!allowedPincodes.includes(cleanCode)) {
    //   toast.error('Currently we are not delivering in your location');
    //   return false;
    // }
    setPincode(cleanCode);
    return true;
  };

  const removeFromCart = (productId, variation = 'default') => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === productId && item.variation === variation)
      )
    );
  };

  const removePackFromCart = (instanceId) => {
    setPackItems((prevItems) =>
      prevItems.filter((item) => item.instanceId !== instanceId)
    );
  };

  const updateQuantity = (productId, variation, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, variation);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId && item.variation === variation
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updatePackQuantity = (instanceId, quantity) => {
    if (quantity <= 0) {
      removePackFromCart(instanceId);
      return;
    }

    setPackItems((prevItems) =>
      prevItems.map((item) =>
        item.instanceId === instanceId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setPackItems([]);
  };

  const getCartTotal = () => {
    const itemsTotal = cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      return total + price * item.quantity;
    }, 0);

    const packsTotal = packItems.reduce((total, pack) => {
      return total + pack.packPrice * pack.quantity;
    }, 0);

    return itemsTotal + packsTotal;
  };

  const getCartItemsCount = () => {
    const itemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const packsCount = packItems.reduce((total, pack) => total + pack.quantity, 0);
    return itemsCount + packsCount;
  };

  const value = {
    cartItems,
    packItems,
    inProgressPacks,
    pincode,
    addToCart,
    addPackToCart,
    startOrUpdateInProgressPack,
    finalizeInProgressPack,
    removeInProgressPack,
    setPincode,
    validateAndSetPincode,
    removeFromCart,
    removePackFromCart,
    updateQuantity,
    updatePackQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

