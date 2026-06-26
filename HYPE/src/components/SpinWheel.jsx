import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import {
  setIdentifier,
  setSegments,
  completeSpin,
  closeSpinWheel,
  selectShowSpinWheel,
  selectIdentifier,
  selectLastWonReward,
  selectCanSpin,
  selectNextSpinDate,
  selectLastSpinDate,
  selectSegments,
  SPIN_INTERVAL_MS,
} from '../store/slices/rewardsSlice'
import { fetchSpinConfig, saveSpinReward } from '../utils/api'
import { IoClose } from 'react-icons/io5'
import { FaGift, FaStar, FaTruck, FaCoins, FaPercentage, FaRedo, FaClock } from 'react-icons/fa'

const WHEEL_SIZE = 240
const NUM_FULL_SPINS = 6

const SEGMENT_ICONS = {
  discount_percent: <FaPercentage />,
  reward_points: <FaCoins />,
  free_shipping: <FaTruck />,
  none: <FaRedo />,
}

function getRandomWeightedIndex(segments) {
  const totalWeight = segments.reduce((sum, s) => sum + s.weight, 0)
  let r = Math.random() * totalWeight
  for (let i = 0; i < segments.length; i++) {
    r -= segments[i].weight
    if (r <= 0) return i
  }
  return 0
}

const SpinWheel = () => {
  const dispatch = useDispatch()
  const show = useSelector(selectShowSpinWheel)
  const savedIdentifier = useSelector(selectIdentifier)
  const lastWonReward = useSelector(selectLastWonReward)
  const canSpin = useSelector(selectCanSpin)
  const nextSpinDate = useSelector(selectNextSpinDate)
  const lastSpinDate = useSelector(selectLastSpinDate)
  const segments = useSelector(selectSegments)
  const segmentAngle = 360 / segments.length

  const [inputValue, setInputValue] = useState(savedIdentifier || '')
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [wonSegmentIndex, setWonSegmentIndex] = useState(null)
  const [stage, setStage] = useState('form')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    fetchSpinConfig().then((segments) => {
      if (segments && segments.length > 0) dispatch(setSegments(segments))
    }).catch(() => {})
  }, [dispatch])

  useEffect(() => {
    if (!show) return
    if (stage === 'spinning' || stage === 'result') return
    if (!savedIdentifier) {
      setStage('form')
      return
    }
    if (canSpin) {
      setStage('ready')
    } else {
      setStage('cooldown')
    }
    setShowResult(false)
    setWonSegmentIndex(null)
  }, [show, savedIdentifier, canSpin, stage])

  const wheelSize = isMobile ? 200 : WHEEL_SIZE

  const isValid = useMemo(() => {
    if (!inputValue) return false
    return inputValue.includes('@') || /^[6-9]\d{9}$/.test(inputValue)
  }, [inputValue])

  const formatNextSpin = () => {
    if (!nextSpinDate) return ''
    const d = new Date(nextSpinDate)
    const now = new Date()
    const diff = d - now
    if (diff <= 0) return 'now'
    const hours = Math.floor(diff / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)
    if (hours > 24) {
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    return `${hours}h ${mins}m`
  }

  const gradientStops = segments.map((seg, i) => {
    const start = i * segmentAngle
    const end = (i + 1) * segmentAngle
    return `${seg.color} ${start}deg ${end}deg`
  }).join(', ')

  const segmentLabels = useMemo(() =>
    segments.map((seg, i) => {
      const angle = i * segmentAngle + segmentAngle / 2
      const rad = (angle - 90) * (Math.PI / 180)
      const radius = wheelSize * 0.37
      const x = wheelSize / 2 + radius * Math.cos(rad)
      const y = wheelSize / 2 + radius * Math.sin(rad)
      return { ...seg, angle, x, y, index: i }
    }),
  [segments, segmentAngle, wheelSize])

  const executeSpin = useCallback((identifier) => {
    setIsSpinning(true)
    setShowResult(false)
    setStage('spinning')

    const winIndex = getRandomWeightedIndex(segments)
    setWonSegmentIndex(winIndex)

    const targetAngle = (winIndex + 0.5) * segmentAngle
    const totalRotation = NUM_FULL_SPINS * 360 + targetAngle
    const finalRotation = rotation + totalRotation

    setRotation(finalRotation)

    const won = segments[winIndex]
    if (won.type !== 'none') {
      saveSpinReward(identifier, won.type, won.value, won.label, 1).catch(() => {})
    }

    setTimeout(() => {
      setIsSpinning(false)
      setShowResult(true)
      setStage('result')

      if (won.type !== 'none') {
        dispatch(completeSpin(won))
      }
    }, 4000)
  }, [rotation, dispatch, segments, segmentAngle])

  const handleSpin = useCallback(() => {
    if (!isValid || isSpinning) return

    const identifier = savedIdentifier || inputValue

    if (!savedIdentifier) {
      dispatch(setIdentifier(inputValue))
    }

    if (savedIdentifier && !canSpin) {
      setStage('cooldown')
      return
    }

    executeSpin(identifier)
  }, [inputValue, isSpinning, savedIdentifier, canSpin, isValid, executeSpin, dispatch])

  const handleClose = useCallback(() => {
    dispatch(closeSpinWheel())
    setShowResult(false)
    setWonSegmentIndex(null)
  }, [dispatch])

  const inputRef = useRef(null)

  const wonSegment = wonSegmentIndex !== null ? segments[wonSegmentIndex] : null

  const rewardDescription = (seg) => {
    switch (seg.type) {
      case 'discount_percent': return `${seg.value}% off on your order`
      case 'reward_points': return `${seg.value} reward points credited`
      case 'free_shipping': return 'Free shipping on next order'
      case 'none': return 'Try again next time!'
      default: return seg.label
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSpinning) {
      handleClose()
    }
  }

  const wheelElement = (
    <div style={{ position: 'relative', width: wheelSize, height: wheelSize, flexShrink: 0 }}>
      <div
        style={{
          position: 'absolute',
          top: -10,
          left: '50%',
          marginLeft: -12,
          zIndex: 5,
          width: 0,
          height: 0,
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: '20px solid #1a1a1a',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }}
      />
      <motion.div
        animate={{ rotate: rotation }}
        transition={isSpinning ? {
          duration: 3.5,
          ease: [0.15, 0.7, 0.3, 1],
        } : { duration: 0 }}
        style={{
          width: wheelSize,
          height: wheelSize,
          borderRadius: '50%',
          background: `conic-gradient(${gradientStops})`,
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 0 30px rgba(255,255,255,0.1)',
          border: '4px solid #fff',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: '#fff',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 2,
            fontWeight: 700,
            fontSize: 10,
            color: '#1a1a1a',
          }}
        >
          FREE
        </div>

        {segmentLabels.map((seg) => {
          const midAngle = seg.angle
          const rad = (midAngle - 90) * (Math.PI / 180)
          const labelRadius = wheelSize * 0.3
          const lx = wheelSize / 2 + labelRadius * Math.cos(rad)
          const ly = wheelSize / 2 + labelRadius * Math.sin(rad)

          return (
            <div
              key={seg.index}
              style={{
                position: 'absolute',
                left: lx - 35,
                top: ly - 8,
                width: 70,
                textAlign: 'center',
                fontSize: 9,
                fontWeight: 700,
                color: '#fff',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                pointerEvents: 'none',
                transform: `rotate(${midAngle}deg)`,
                transformOrigin: `${35}px ${8}px`,
                letterSpacing: '0.3px',
              }}
            >
              {seg.label}
            </div>
          )
        })}
      </motion.div>
    </div>
  )

  const formContent = (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
          boxShadow: '0 4px 12px rgba(245,158,11,0.15)',
        }}>
          <FaGift size={22} color="#D97706" />
        </div>
        <h2 style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#111827',
          margin: 0,
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '-0.3px',
        }}>
          Spin & Win!
        </h2>
        <p style={{
          fontSize: 13,
          color: '#6B7280',
          margin: '8px 0 0',
          lineHeight: 1.5,
          fontFamily: "'Inter', sans-serif",
        }}>
          Enter your email or phone to spin the wheel and win exciting rewards!
        </p>
      </div>

      <div style={{ position: 'relative', marginBottom: 14 }}>
        <div style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9CA3AF',
          fontSize: 15,
          zIndex: 1,
          pointerEvents: 'none',
          lineHeight: 1,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && isValid) handleSpin() }}
          placeholder="Email or mobile number"
          style={{
            width: '100%',
            padding: '13px 14px 13px 42px',
            fontSize: 14,
            border: `2px solid ${!inputValue ? '#E5E7EB' : isValid ? '#10B981' : '#FCA5A5'}`,
            borderRadius: 12,
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
            e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.1)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
            e.target.style.backgroundColor = '#F9FAFB';
            if (!inputValue) {
              e.target.style.borderColor = '#E5E7EB';
            } else if (isValid) {
              e.target.style.borderColor = '#10B981';
            } else {
              e.target.style.borderColor = '#FCA5A5';
            }
          }}
        />
      </div>
      {inputValue && !isValid && (
        <p style={{
          margin: '-8px 0 14px',
          fontSize: 12,
          color: '#EF4444',
          fontFamily: "'Inter', sans-serif",
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          Please enter a valid email or Indian mobile number
        </p>
      )}

      <button
        onClick={handleSpin}
        disabled={!isValid}
        style={{
          width: '100%',
          padding: '14px 20px',
          fontSize: 15,
          fontWeight: 600,
          border: 'none',
          borderRadius: 12,
          cursor: isValid ? 'pointer' : 'not-allowed',
          background: isValid
            ? 'linear-gradient(135deg, #F59E0B, #D97706)'
            : '#E5E7EB',
          color: isValid ? '#fff' : '#9CA3AF',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontFamily: "'Inter', sans-serif",
          boxShadow: isValid ? '0 4px 14px rgba(245,158,11,0.3)' : 'none',
          letterSpacing: '0.2px',
        }}
        onMouseEnter={(e) => {
          if (isValid) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,158,11,0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (isValid) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(245,158,11,0.3)';
          }
        }}
      >
        <FaGift size={16} />
        {isValid ? 'Spin the Wheel!' : 'Enter details to spin'}
      </button>
    </div>
  )

  const readyContent = (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 14px',
        boxShadow: '0 4px 12px rgba(245,158,11,0.15)',
      }}>
        <FaGift size={22} color="#D97706" />
      </div>
      <h2 style={{
        fontSize: 22,
        fontWeight: 700,
        color: '#111827',
        margin: 0,
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '-0.3px',
      }}>
        Ready to Spin!
      </h2>
      <p style={{
        fontSize: 12,
        color: '#6B7280',
        margin: '8px 0 20px',
        wordBreak: 'break-all',
        fontFamily: "'Inter', sans-serif",
        backgroundColor: '#F3F4F6',
        padding: '6px 12px',
        borderRadius: 8,
        display: 'inline-block',
      }}>
        {savedIdentifier}
      </p>
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        style={{
          width: '100%',
          padding: '14px 20px',
          fontSize: 15,
          fontWeight: 600,
          border: 'none',
          borderRadius: 12,
          cursor: isSpinning ? 'not-allowed' : 'pointer',
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          color: '#fff',
          transition: 'all 0.2s',
          fontFamily: "'Inter', sans-serif",
          boxShadow: '0 4px 14px rgba(245,158,11,0.3)',
          letterSpacing: '0.5px',
        }}
        onMouseEnter={(e) => {
          if (!isSpinning) {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,158,11,0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSpinning) {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(245,158,11,0.3)';
          }
        }}
      >
        {isSpinning ? 'Spinning...' : 'SPIN NOW'}
      </button>
    </div>
  )

  const cooldownContent = (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 14px',
        boxShadow: '0 4px 12px rgba(239,68,68,0.15)',
      }}>
        <FaClock size={22} color="#DC2626" />
      </div>
      <h2 style={{
        fontSize: 20,
        fontWeight: 700,
        color: '#111827',
        margin: 0,
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '-0.3px',
      }}>
        Already Spun!
      </h2>
      <p style={{ fontSize: 13, color: '#6B7280', margin: '8px 0 4px', fontFamily: "'Inter', sans-serif" }}>
        Next spin available in:
      </p>
      <p style={{
        fontSize: 22,
        fontWeight: 700,
        color: '#DC2626',
        margin: '6px 0',
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '-0.3px',
      }}>
        {formatNextSpin()}
      </p>
      <p style={{
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 14,
        wordBreak: 'break-all',
        fontFamily: "'Inter', sans-serif",
        backgroundColor: '#F3F4F6',
        padding: '4px 10px',
        borderRadius: 6,
        display: 'inline-block',
      }}>
        {savedIdentifier}
      </p>
      <button
        onClick={handleClose}
        style={{
          marginTop: 18,
          padding: '12px 32px',
          fontSize: 14,
          fontWeight: 600,
          border: '2px solid #E5E7EB',
          borderRadius: 10,
          background: '#fff',
          cursor: 'pointer',
          color: '#6B7280',
          fontFamily: "'Inter', sans-serif",
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.backgroundColor = '#fff'; }}
      >
        Close
      </button>
    </div>
  )

  const spinResultContent = (
    <div style={{ textAlign: 'center' }}>
      {stage === 'spinning' && (
        <>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0, fontFamily: "'Inter', sans-serif" }}>
            Spinning...
          </h2>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '6px 0 0', fontFamily: "'Inter', sans-serif" }}>
            Good luck!
          </p>
        </>
      )}
      {stage === 'result' && wonSegment && (
        <div>
          <div style={{
            background: wonSegment.type === 'none'
              ? 'linear-gradient(135deg, #F3F4F6, #E5E7EB)'
              : 'linear-gradient(135deg, #F59E0B, #D97706)',
            padding: '20px 16px',
            borderRadius: 16,
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>
              {wonSegment.type === 'none' ? '😔' : '🎉'}
            </div>
            <h3 style={{
              fontSize: 16,
              fontWeight: 700,
              color: wonSegment.type === 'none' ? '#6B7280' : '#fff',
              margin: 0,
              fontFamily: "'Inter', sans-serif",
            }}>
              {wonSegment.type === 'none' ? 'Better Luck!' : 'Congratulations!'}
            </h3>
            {wonSegment.type !== 'none' && (
              <>
                <p style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: '#fff',
                  margin: '8px 0 2px',
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '-0.5px',
                }}>
                  {wonSegment.label}
                </p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0, fontFamily: "'Inter', sans-serif" }}>
                  {rewardDescription(wonSegment)}
                </p>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '11px 14px',
                fontSize: 13,
                fontWeight: 600,
                border: '2px solid #E5E7EB',
                borderRadius: 10,
                background: '#fff',
                cursor: 'pointer',
                color: '#6B7280',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.backgroundColor = '#fff'; }}
            >
              Close
            </button>
            {wonSegment.type !== 'none' && (
              <button
                onClick={handleClose}
                style={{
                  flex: 1,
                  padding: '11px 14px',
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(245,158,11,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(245,158,11,0.3)'; }}
              >
                Claim Reward
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
    return () => style.remove();
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            padding: 16,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              borderRadius: 24,
              padding: isMobile ? 24 : 32,
              maxWidth: isMobile ? 420 : 620,
              width: '100%',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'transparent',
                border: 'none',
                fontSize: 22,
                cursor: 'pointer',
                color: '#999',
                zIndex: 10,
                padding: 4,
                lineHeight: 1,
              }}
            >
              <IoClose />
            </button>

            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 20 : 28,
              alignItems: isMobile ? 'center' : 'flex-start',
              marginTop: isMobile ? 0 : 0,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: isMobile ? '100%' : 'auto',
              }}>
                {wheelElement}
              </div>

              <div style={{
                flex: 1,
                width: isMobile ? '100%' : 'auto',
                minWidth: 0,
              }}>
                {stage === 'form' && formContent}
                {stage === 'ready' && readyContent}
                {stage === 'cooldown' && cooldownContent}
                {(stage === 'spinning' || stage === 'result') && spinResultContent}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SpinWheel
