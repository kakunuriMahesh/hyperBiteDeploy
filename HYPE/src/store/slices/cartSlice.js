import { createSlice } from '@reduxjs/toolkit'

const load = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch { return fallback }
}

const initialState = {
  cartItems: load('cart', []),
  packItems: load('packs', []),
  inProgressPacks: load('inProgressPacks', []),
  pincode: load('pincode', '') || '',
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload
      const idx = state.cartItems.findIndex(
        item => item.id === product.id && item.variation === (product.variation || 'default')
      )
      if (idx !== -1) {
        state.cartItems[idx].quantity += 1
      } else {
        state.cartItems.push({
          ...product,
          quantity: 1,
          variation: product.variation || 'default',
        })
      }
    },
    addPackToCart(state, action) {
      const packData = action.payload
      const itemsKey = JSON.stringify(
        (packData.items || []).map(i => ({ id: i.id, quantity: i.quantity })).sort((a, b) => a.id.localeCompare(b.id))
      )
      const existingIndex = state.packItems.findIndex(p => {
        const pKey = JSON.stringify(
          (p.items || []).map(i => ({ id: i.id, quantity: i.quantity })).sort((a, b) => a.id.localeCompare(b.id))
        )
        return p.packId === packData.packId && pKey === itemsKey
      })
      if (existingIndex !== -1) {
        state.packItems[existingIndex].quantity += 1
      } else {
        const instanceId = `pack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        state.packItems.push({ ...packData, instanceId, quantity: 1 })
      }
    },
    startOrUpdateInProgressPack(state, action) {
      const packData = action.payload
      const idx = state.inProgressPacks.findIndex(p => p.packId === packData.packId)
      if (idx !== -1) {
        state.inProgressPacks[idx] = { ...state.inProgressPacks[idx], ...packData }
      } else {
        state.inProgressPacks.push(packData)
      }
    },
    removeInProgressPack(state, action) {
      state.inProgressPacks = state.inProgressPacks.filter(p => p.packId !== action.payload)
    },
    finalizeInProgressPack(state, action) {
      const packId = action.payload
      const pack = state.inProgressPacks.find(p => p.packId === packId)
      if (!pack) return
      const instanceId = `pack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      state.packItems.push({
        packId: pack.packId,
        packName: pack.packName,
        packPrice: pack.packPrice || pack.total || 0,
        packOffPrice: pack.packOffPrice || 0,
        items: pack.items || [],
        total: pack.total || 0,
        instanceId,
        quantity: 1,
      })
      state.inProgressPacks = state.inProgressPacks.filter(p => p.packId !== packId)
    },
    setPincode(state, action) {
      state.pincode = action.payload
    },
    validateAndSetPincode(state, action) {
      const cleanCode = String(action.payload).trim()
      state.pincode = cleanCode
    },
    removeFromCart(state, action) {
      const { productId, variation = 'default' } = action.payload
      state.cartItems = state.cartItems.filter(
        item => !(item.id === productId && item.variation === variation)
      )
    },
    removePackFromCart(state, action) {
      state.packItems = state.packItems.filter(item => item.instanceId !== action.payload)
    },
    updateQuantity(state, action) {
      const { productId, variation = 'default', quantity } = action.payload
      if (quantity <= 0) {
        state.cartItems = state.cartItems.filter(
          item => !(item.id === productId && item.variation === variation)
        )
        return
      }
      const item = state.cartItems.find(
        item => item.id === productId && item.variation === variation
      )
      if (item) item.quantity = quantity
    },
    updatePackQuantity(state, action) {
      const { instanceId, quantity } = action.payload
      if (quantity <= 0) {
        state.packItems = state.packItems.filter(item => item.instanceId !== instanceId)
        return
      }
      const pack = state.packItems.find(item => item.instanceId === instanceId)
      if (pack) pack.quantity = quantity
    },
    clearCart(state) {
      state.cartItems = []
      state.packItems = []
    },
  },
})

export const {
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
} = cartSlice.actions

export const selectCartItems = state => state.cart.cartItems
export const selectPackItems = state => state.cart.packItems
export const selectInProgressPacks = state => state.cart.inProgressPacks
export const selectPincode = state => state.cart.pincode
export const selectCartTotal = state => {
  const itemsTotal = state.cart.cartItems.reduce((total, item) => {
    const price = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0
    return total + price * item.quantity
  }, 0)
  const packsTotal = state.cart.packItems.reduce((total, pack) => {
    return total + pack.packPrice * pack.quantity
  }, 0)
  return itemsTotal + packsTotal
}
export const selectCartItemsCount = state => {
  const itemsCount = state.cart.cartItems.reduce((total, item) => total + item.quantity, 0)
  const packsCount = state.cart.packItems.reduce((total, pack) => total + pack.quantity, 0)
  return itemsCount + packsCount
}

export default cartSlice.reducer
