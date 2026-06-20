import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
import languageReducer from './slices/languageSlice'

const store = configureStore({
  reducer: {
    cart: cartReducer,
    language: languageReducer,
  },
})

let currentCartState = store.getState().cart
store.subscribe(() => {
  const prev = currentCartState
  const next = store.getState().cart
  if (prev === next) return
  currentCartState = next
  try {
    localStorage.setItem('cart', JSON.stringify(next.cartItems))
    localStorage.setItem('packs', JSON.stringify(next.packItems))
    localStorage.setItem('inProgressPacks', JSON.stringify(next.inProgressPacks))
    if (next.pincode) localStorage.setItem('pincode', next.pincode)
  } catch { /* ignore quota errors */ }
})

export default store
