import { createSlice, createSelector } from '@reduxjs/toolkit'

const EXPIRY_DAYS = 1

export const SPIN_FREQUENCY = {
  type: 'day',
  value: 1,
}

const INTERVAL_MS = {
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
}

export const SPIN_INTERVAL_MS = INTERVAL_MS[SPIN_FREQUENCY.type] * SPIN_FREQUENCY.value

const DEFAULT_SEGMENTS = [
  { label: '10% OFF', type: 'discount_percent', value: 10, color: '#FF6B6B', weight: 20 },
  { label: '50 PTS', type: 'reward_points', value: 50, color: '#4ECDC4', weight: 25 },
  { label: 'Free Ship', type: 'free_shipping', value: 1, color: '#45B7D1', weight: 20 },
  { label: '5% OFF', type: 'discount_percent', value: 5, color: '#96CEB4', weight: 20 },
  { label: '100 PTS', type: 'reward_points', value: 100, color: '#FFEAA7', weight: 10 },
  { label: 'Better Luck', type: 'none', value: 0, color: '#DDA0DD', weight: 5 },
]

function loadState() {
  try {
    const raw = localStorage.getItem('rewardsState')
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

const saved = loadState()

const initialState = {
  identifier: saved?.identifier || '',
  rewards: saved?.rewards || [],
  spinCount: saved?.spinCount || 0,
  lastSpinDate: saved?.lastSpinDate || null,
  showSpinWheel: false,
  showRewardsPanel: false,
  lastWonReward: null,
  segments: null,
  spinConfigActive: true,
}

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    setIdentifier(state, action) {
      state.identifier = action.payload
    },
    openSpinWheel(state) {
      if (!state.spinConfigActive) return
      state.showSpinWheel = true
    },
    closeSpinWheel(state) {
      state.showSpinWheel = false
      state.lastWonReward = null
    },
    completeSpin(state, action) {
      const reward = action.payload
      if (reward.type === 'none') {
        state.lastWonReward = null
        return
      }
      const newReward = {
        ...reward,
        id: `rw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        claimed: false,
        claimedAt: null,
        createdAt: Date.now(),
        expiresAt: Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000,
      }
      state.rewards.push(newReward)
      state.lastWonReward = newReward
      state.spinCount += 1
      state.lastSpinDate = Date.now()
    },
    claimReward(state, action) {
      const id = action.payload
      const reward = state.rewards.find(r => r.id === id)
      if (reward && !reward.claimed) {
        reward.claimed = true
        reward.claimedAt = Date.now()
      }
    },
    toggleRewardsPanel(state) {
      state.showRewardsPanel = !state.showRewardsPanel
    },
    closeRewardsPanel(state) {
      state.showRewardsPanel = false
    },
    setSegments(state, action) {
      state.segments = action.payload
    },
    setSpinConfigActive(state, action) {
      state.spinConfigActive = action.payload
    },
  },
})

export const {
  setIdentifier,
  openSpinWheel,
  closeSpinWheel,
  completeSpin,
  claimReward,
  toggleRewardsPanel,
  closeRewardsPanel,
  setSegments,
  setSpinConfigActive,
} = rewardsSlice.actions

export const selectRewards = state => state.rewards.rewards
export const selectIdentifier = state => state.rewards.identifier
export const selectShowSpinWheel = state => state.rewards.showSpinWheel
export const selectShowRewardsPanel = state => state.rewards.showRewardsPanel
export const selectLastWonReward = state => state.rewards.lastWonReward
const selectRewardsRaw = state => state.rewards.rewards
export const selectUnclaimedRewards = createSelector(
  [selectRewardsRaw],
  (rewards) => rewards.filter(r => !r.claimed && r.expiresAt > Date.now())
)
export const selectUnclaimedCount = createSelector(
  [selectRewardsRaw],
  (rewards) => rewards.filter(r => !r.claimed && r.expiresAt > Date.now()).length
)
export const selectTotalRewardPoints = createSelector(
  [selectRewardsRaw],
  (rewards) => rewards
    .filter(r => r.type === 'reward_points' && !r.claimed && r.expiresAt > Date.now())
    .reduce((sum, r) => sum + r.value, 0)
)

export const selectSegments = state => state.rewards.segments || DEFAULT_SEGMENTS

export const selectLastSpinDate = state => state.rewards.lastSpinDate

export const selectCanSpin = state => {
  const last = state.rewards.lastSpinDate
  if (!last) return true
  return Date.now() - last >= SPIN_INTERVAL_MS
}

export const selectNextSpinDate = state => {
  const last = state.rewards.lastSpinDate
  if (!last) return null
  return last + SPIN_INTERVAL_MS
}

export default rewardsSlice.reducer
