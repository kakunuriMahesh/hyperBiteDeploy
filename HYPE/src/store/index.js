import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slices/cartSlice'
import languageReducer from './slices/languageSlice'
import rewardsReducer from './slices/rewardsSlice'

const store = configureStore({
  reducer: {
    cart: cartReducer,
    language: languageReducer,
    rewards: rewardsReducer,
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

let currentRewardsState = store.getState().rewards
store.subscribe(() => {
  const prev = currentRewardsState
  const next = store.getState().rewards
  if (prev === next) return
  currentRewardsState = next
  try {
    localStorage.setItem('rewardsState', JSON.stringify({
      identifier: next.identifier,
      rewards: next.rewards,
      spinCount: next.spinCount,
      lastSpinDate: next.lastSpinDate,
    }))
  } catch { /* ignore quota errors */ }
})

export default store
