import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  claimReward,
  openSpinWheel,
  setIdentifier,
  selectRewards,
  selectIdentifier,
  selectTotalRewardPoints,
  selectUnclaimedCount,
  selectCanSpin,
} from '../store/slices/rewardsSlice'
import { lookupRewards, claimRewardAPI } from '../utils/api'
import { FaGift, FaCoins, FaPercentage, FaTruck, FaCheck, FaTimes, FaRedo, FaTrophy, FaClock, FaSearch, FaArrowRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const FILTERS = ['unclaimed', 'claimed', 'expired', 'all']

const rewardMeta = {
  discount_percent: { icon: <FaPercentage />, label: 'Discount', color: '#FF6B6B', bg: '#FFF0F0' },
  reward_points: { icon: <FaCoins />, label: 'Reward Points', color: '#4ECDC4', bg: '#F0FFFD' },
  free_shipping: { icon: <FaTruck />, label: 'Free Shipping', color: '#45B7D1', bg: '#F0F8FF' },
  none: { icon: <FaRedo />, label: 'No Reward', color: '#DDA0DD', bg: '#FDF0FF' },
}

const RewardsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const rewards = useSelector(selectRewards)
  const identifier = useSelector(selectIdentifier)
  const totalPoints = useSelector(selectTotalRewardPoints)
  const unclaimedCount = useSelector(selectUnclaimedCount)
  const canSpin = useSelector(selectCanSpin)
  const [activeFilter, setActiveFilter] = useState('unclaimed')
  const [lookupValue, setLookupValue] = useState(identifier || '')
  const [showLookup, setShowLookup] = useState(!identifier)
  const [isMobile, setIsMobile] = useState(false)
  const [apiRewards, setApiRewards] = useState(null)
  const [apiTotalPoints, setApiTotalPoints] = useState(0)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [useApiData, setUseApiData] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const isValid = useMemo(() => {
    if (!lookupValue) return false
    return lookupValue.includes('@') || /^[6-9]\d{9}$/.test(lookupValue)
  }, [lookupValue])

  const handleLookup = useCallback(async () => {
    if (!isValid) return
    setLookupLoading(true)
    try {
      const data = await lookupRewards(lookupValue)
      setApiRewards(data.rewards)
      setApiTotalPoints(data.totalPoints)
      setUseApiData(true)
    } catch {
      setUseApiData(false)
    } finally {
      dispatch(setIdentifier(lookupValue))
      setShowLookup(false)
      setLookupLoading(false)
    }
  }, [lookupValue, isValid, dispatch])

  const handleClaim = useCallback(async (rewardId) => {
    if (useApiData && apiRewards) {
      try {
        await claimRewardAPI(rewardId, identifier)
        const updated = apiRewards.map(r =>
          r.id === rewardId ? { ...r, claimed: true } : r
        )
        setApiRewards(updated)
        const pts = updated
          .filter(r => r.type === 'reward_points' && !r.claimed)
          .reduce((sum, r) => sum + r.value, 0)
        setApiTotalPoints(pts)
        toast.success('Reward claimed successfully!')
      } catch {
        toast.error('Failed to claim reward from server.')
        const updated = apiRewards.map(r =>
          r.id === rewardId ? { ...r, claimed: true } : r
        )
        setApiRewards(updated)
        const pts = updated
          .filter(r => r.type === 'reward_points' && !r.claimed)
          .reduce((sum, r) => sum + r.value, 0)
        setApiTotalPoints(pts)
      }
    } else {
      dispatch(claimReward(rewardId))
    }
  }, [useApiData, apiRewards, identifier, dispatch])

  const formatDate = (ts) => {
    const d = new Date(ts)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const isExpired = (expiresAt) => expiresAt < Date.now()

  const sourceRewards = useApiData && apiRewards ? apiRewards : rewards
  const sourceTotalPoints = useApiData ? apiTotalPoints : totalPoints
  const sourceUnclaimedCount = useApiData
    ? (apiRewards ? apiRewards.filter(r => !r.claimed).length : 0)
    : unclaimedCount

  const filteredRewards = useMemo(() => {
    const sorted = [...sourceRewards].reverse()
    switch (activeFilter) {
      case 'unclaimed':
        return sorted.filter(r => !r.claimed && !isExpired(r.expiresAt))
      case 'claimed':
        return sorted.filter(r => r.claimed)
      case 'expired':
        return sorted.filter(r => isExpired(r.expiresAt))
      default:
        return sorted
    }
  }, [sourceRewards, activeFilter])

  const stats = useMemo(() => [
    { label: 'Total Points', value: sourceTotalPoints, icon: <FaCoins />, color: '#4ECDC4', gradient: 'linear-gradient(135deg, #4ECDC4, #44B09E)' },
    { label: 'Unclaimed', value: sourceUnclaimedCount, icon: <FaGift />, color: '#FFD700', gradient: 'linear-gradient(135deg, #FFD700, #FFA500)' },
    { label: 'Total Earned', value: sourceRewards.length, icon: <FaTrophy />, color: '#45B7D1', gradient: 'linear-gradient(135deg, #45B7D1, #2E86AB)' },
  ], [sourceTotalPoints, sourceUnclaimedCount, sourceRewards.length])

  const containerMaxW = isMobile ? '100%' : 960
  const contentPad = isMobile ? '0 16px' : '0 32px'

  return (
    <div style={{
      minHeight: '100vh',
      background: isMobile
        ? 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 50%, #f5f7fa 100%)',
      paddingTop: isMobile ? 100 : 130,
      paddingBottom: isMobile ? 60 : 100,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {!isMobile && (
        <>
          <div style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(78,205,196,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
        </>
      )}

      <div style={{
        maxWidth: containerMaxW,
        margin: '0 auto',
        padding: contentPad,
        position: 'relative',
        zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? 24 : 40,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            style={{
              width: isMobile ? 64 : 80,
              height: isMobile ? 64 : 80,
              borderRadius: isMobile ? 20 : 24,
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 12px 32px rgba(255, 165, 0, 0.3)',
            }}
          >
            <FaGift size={isMobile ? 26 : 32} color="#fff" />
          </motion.div>
          <h1 style={{
            fontSize: isMobile ? 28 : 36,
            fontWeight: 800,
            color: '#111827',
            margin: 0,
            letterSpacing: '-0.5px',
            fontFamily: "'Inter', sans-serif",
          }}>
            My Rewards
          </h1>
          <p style={{
            fontSize: isMobile ? 13 : 15,
            color: '#6B7280',
            margin: '6px 0 0',
            fontFamily: "'Inter', sans-serif",
          }}>
            Track and claim your rewards
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            backgroundColor: '#fff',
            borderRadius: isMobile ? 20 : 28,
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: isMobile
              ? '0 4px 24px rgba(0,0,0,0.06)'
              : '0 8px 40px rgba(0,0,0,0.08)',
            padding: isMobile ? 20 : '28px 32px',
            marginBottom: isMobile ? 20 : 32,
            backdropFilter: 'blur(20px)',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 10 : 16,
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <div style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9CA3AF',
                fontSize: 14,
                pointerEvents: 'none',
                lineHeight: 1,
                zIndex: 1,
              }}>
                <FaSearch />
              </div>
              <input
                type="text"
                value={lookupValue}
                onChange={(e) => setLookupValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && isValid) handleLookup() }}
                placeholder="Enter email or phone"
                style={{
                  width: '100%',
                  padding: isMobile ? '12px 14px 12px 42px' : '14px 16px 14px 44px',
                  fontSize: isMobile ? 14 : 15,
                  border: `2px solid ${!lookupValue ? '#E5E7EB' : isValid ? '#10B981' : '#FCA5A5'}`,
                  borderRadius: isMobile ? 12 : 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s',
                  backgroundColor: '#F9FAFB',
                  fontFamily: "'Inter', sans-serif",
                  color: '#111827',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#F59E0B';
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.boxShadow = '0 0 0 4px rgba(245,158,11,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = '#F9FAFB';
                  if (!lookupValue) e.target.style.borderColor = '#E5E7EB';
                  else if (isValid) e.target.style.borderColor = '#10B981';
                  else e.target.style.borderColor = '#FCA5A5';
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLookup}
              disabled={!isValid || lookupLoading}
              style={{
                padding: isMobile ? '12px 16px' : '14px 28px',
                fontSize: isMobile ? 13 : 15,
                fontWeight: 600,
                border: 'none',
                borderRadius: isMobile ? 12 : 14,
                cursor: isValid && !lookupLoading ? 'pointer' : 'not-allowed',
                background: isValid && !lookupLoading
                  ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                  : '#E5E7EB',
                color: isValid && !lookupLoading ? '#1a1a1a' : '#9CA3AF',
                fontFamily: "'Inter', sans-serif",
                whiteSpace: 'nowrap',
                boxShadow: isValid && !lookupLoading ? '0 4px 16px rgba(255, 165, 0, 0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
              }}
            >
              {lookupLoading ? 'Loading...' : !isMobile && <FaArrowRight size={12} />}
            </motion.button>
          </div>
          {lookupValue && !isValid && (
            <p style={{
              margin: '8px 0 0',
              fontSize: 12,
              color: '#EF4444',
              fontFamily: "'Inter', sans-serif",
            }}>
              Enter a valid email or Indian mobile number
            </p>
          )}
        </motion.div>

        {identifier && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: isMobile ? 20 : 28,
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#fff',
                padding: isMobile ? '6px 12px 6px 16px' : '8px 16px 8px 20px',
                borderRadius: 100,
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <FaGift size={isMobile ? 12 : 14} color="#FFD700" />
                <span style={{
                  fontSize: isMobile ? 13 : 14,
                  color: '#6B7280',
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {identifier}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setShowLookup(true); setLookupValue('') }}
                style={{
                  background: 'none',
                  border: '1px solid #E5E7EB',
                  fontSize: 12,
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  padding: isMobile ? '6px 12px' : '8px 16px',
                  borderRadius: 100,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.color = '#F59E0B' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#6B7280' }}
              >
                Change
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: isMobile ? 10 : 20,
                marginBottom: isMobile ? 20 : 32,
              }}
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={isMobile ? {} : { y: -4, scale: 1.01 }}
                  style={{
                    background: '#fff',
                    borderRadius: isMobile ? 16 : 20,
                    padding: isMobile ? '16px' : '24px',
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? 14 : 20,
                    transition: 'box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isMobile) e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isMobile) e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                  }}
                >
                  <div style={{
                    width: isMobile ? 44 : 56,
                    height: isMobile ? 44 : 56,
                    borderRadius: isMobile ? 14 : 18,
                    background: stat.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobile ? 20 : 24,
                    color: '#fff',
                    flexShrink: 0,
                    boxShadow: `0 4px 12px ${stat.color}40`,
                  }}>
                    {stat.icon}
                  </div>
                  <div>
                    <div style={{
                      fontSize: isMobile ? 22 : 30,
                      fontWeight: 800,
                      color: '#111827',
                      letterSpacing: '-0.5px',
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.2,
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontSize: isMobile ? 12 : 14,
                      color: '#9CA3AF',
                      fontWeight: 500,
                      marginTop: 2,
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                backgroundColor: '#fff',
                borderRadius: isMobile ? 20 : 24,
                border: '1px solid #f0f0f0',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                overflow: 'hidden',
              }}
            >
              <div style={{
                display: 'flex',
                padding: isMobile ? '4px 4px 0' : '6px 6px 0',
                gap: 2,
                backgroundColor: '#F9FAFB',
                borderBottom: '1px solid #f0f0f0',
              }}>
                {FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    style={{
                      flex: 1,
                      padding: isMobile ? '10px 6px' : '14px 12px',
                      fontSize: isMobile ? 11 : 13,
                      fontWeight: activeFilter === filter ? 600 : 400,
                      border: 'none',
                      background: activeFilter === filter ? '#fff' : 'transparent',
                      cursor: 'pointer',
                      color: activeFilter === filter ? '#111827' : '#9CA3AF',
                      borderRadius: isMobile ? '10px 10px 0 0' : '12px 12px 0 0',
                      transition: 'all 0.2s',
                      textTransform: 'capitalize',
                      letterSpacing: '0.3px',
                      position: 'relative',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {filter === 'unclaimed' && unclaimedCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: isMobile ? 4 : 6,
                        right: isMobile ? 4 : 8,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#FFD700',
                      }} />
                    )}
                    {filter}
                  </button>
                ))}
              </div>

              <div style={{ padding: isMobile ? 12 : 20 }}>
                <AnimatePresence mode="wait">
                  {filteredRewards.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        textAlign: 'center',
                        padding: isMobile ? '40px 16px' : '56px 24px',
                      }}
                    >
                      <div style={{
                        width: isMobile ? 48 : 64,
                        height: isMobile ? 48 : 64,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #F3F4F6, #E5E7EB)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        fontSize: isMobile ? 20 : 28,
                        color: '#D1D5DB',
                      }}>
                        {activeFilter === 'claimed' ? <FaCheck /> : activeFilter === 'expired' ? <FaClock /> : <FaGift />}
                      </div>
                      <p style={{
                        fontSize: isMobile ? 14 : 16,
                        color: '#9CA3AF',
                        margin: '0 0 4px',
                        fontFamily: "'Inter', sans-serif",
                      }}>
                        No {activeFilter !== 'all' ? activeFilter : ''} rewards
                      </p>
                      {activeFilter === 'unclaimed' && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => dispatch(openSpinWheel())}
                          style={{
                            marginTop: 20,
                            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                            border: 'none',
                            borderRadius: isMobile ? 10 : 12,
                            padding: isMobile ? '10px 24px' : '12px 28px',
                            fontSize: isMobile ? 13 : 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            color: '#1a1a1a',
                            fontFamily: "'Inter', sans-serif",
                            boxShadow: '0 4px 12px rgba(255, 165, 0, 0.25)',
                          }}
                        >
                          Spin for Rewards
                        </motion.button>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeFilter}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {filteredRewards.map((reward, index) => {
                        const expired = isExpired(reward.expiresAt)
                        const meta = rewardMeta[reward.type] || rewardMeta.none

                        return (
                          <motion.div
                            key={reward.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            style={{
                              padding: isMobile ? '12px 14px' : '16px 20px',
                              borderRadius: isMobile ? 14 : 16,
                              marginBottom: 8,
                              backgroundColor: reward.claimed ? '#FAFAFA' : '#FFFCF5',
                              border: `1px solid ${reward.claimed ? '#EEEEEE' : '#FDE68A'}`,
                              opacity: expired ? 0.5 : 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: isMobile ? 12 : 16,
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              if (!isMobile && !reward.claimed && !expired) {
                                e.currentTarget.style.borderColor = '#FCD34D';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,165,0,0.1)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isMobile && !reward.claimed && !expired) {
                                e.currentTarget.style.borderColor = '#FDE68A';
                                e.currentTarget.style.boxShadow = 'none';
                              }
                            }}
                          >
                            <div style={{
                              width: isMobile ? 40 : 48,
                              height: isMobile ? 40 : 48,
                              borderRadius: isMobile ? 12 : 14,
                              backgroundColor: meta.bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: isMobile ? 16 : 20,
                              color: meta.color,
                              flexShrink: 0,
                            }}>
                              {meta.icon}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{
                                margin: 0,
                                fontSize: isMobile ? 13 : 15,
                                fontWeight: 600,
                                color: '#111827',
                                fontFamily: "'Inter', sans-serif",
                              }}>
                                {reward.label}
                              </p>
                              <p style={{
                                margin: '2px 0',
                                fontSize: isMobile ? 11 : 13,
                                color: '#6B7280',
                                fontFamily: "'Inter', sans-serif",
                              }}>
                                {reward.type === 'reward_points' ? `${reward.value} Reward Points` :
                                 reward.type === 'discount_percent' ? `${reward.value}% Discount` :
                                 reward.type === 'free_shipping' ? 'Free Shipping' : ''}
                              </p>
                              <p style={{
                                margin: 0,
                                fontSize: isMobile ? 10 : 12,
                                color: expired ? '#EF4444' : reward.claimed ? '#10B981' : '#9CA3AF',
                                fontFamily: "'Inter', sans-serif",
                              }}>
                                {reward.claimed ? `Claimed on ${formatDate(reward.claimedAt)}` :
                                 expired ? 'Expired' : `Expires ${formatDate(reward.expiresAt)}`}
                              </p>
                            </div>

                            <div style={{ flexShrink: 0 }}>
                              {reward.claimed ? (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  color: '#10B981',
                                  fontSize: isMobile ? 11 : 12,
                                  fontWeight: 600,
                                  backgroundColor: '#F0FDF4',
                                  padding: isMobile ? '5px 10px' : '6px 14px',
                                  borderRadius: 8,
                                  fontFamily: "'Inter', sans-serif",
                                }}>
                                  <FaCheck size={isMobile ? 9 : 10} />
                                  Claimed
                                </div>
                              ) : expired ? (
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  color: '#EF4444',
                                  fontSize: isMobile ? 11 : 12,
                                  fontWeight: 600,
                                  backgroundColor: '#FEF2F2',
                                  padding: isMobile ? '5px 10px' : '6px 14px',
                                  borderRadius: 8,
                                  fontFamily: "'Inter', sans-serif",
                                }}>
                                  <FaTimes size={isMobile ? 9 : 10} />
                                  Expired
                                </div>
                              ) : (
                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => handleClaim(reward.id)}
                                  style={{
                                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                                    border: 'none',
                                    borderRadius: isMobile ? 8 : 10,
                                    padding: isMobile ? '7px 14px' : '8px 20px',
                                    fontSize: isMobile ? 11 : 13,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    color: '#1a1a1a',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 2px 8px rgba(255, 165, 0, 0.2)',
                                    fontFamily: "'Inter', sans-serif",
                                  }}
                                >
                                  Claim
                                </motion.button>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {(canSpin || !identifier) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ textAlign: 'center', marginTop: isMobile ? 24 : 32 }}
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => dispatch(openSpinWheel())}
                  style={{
                    background: 'linear-gradient(135deg, #111827, #1F2937)',
                    border: 'none',
                    borderRadius: isMobile ? 12 : 14,
                    padding: isMobile ? '12px 28px' : '14px 36px',
                    fontSize: isMobile ? 14 : 15,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#fff',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <FaRedo size={isMobile ? 12 : 13} />
                  Spin Again
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default RewardsPage
