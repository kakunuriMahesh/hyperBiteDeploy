import React, { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'

const slides = [
  { img: '/assets/SKU/skuCashewCharge.webp', desc: 'Crunchy cashew energy bites for a sustained charge throughout your day.', word: 'Charge' },
  { img: '/assets/SKU/skuMilletMatrix.webp', desc: 'Ancient grain millet matrix packed with fibre and essential nutrients.', word: 'Fuel' },
  { img: '/assets/SKU/skuOatsOctane.webp', desc: 'Oats meet octane — high-energy snacking for an active lifestyle.', word: 'Power' },
  { img: '/assets/SKU/skuPowerChunk.webp', desc: 'Power-packed chunks of nutrition in every single bite.', word: 'Boost' },
  { img: '/assets/SKU/skuSeedBoost.webp', desc: 'Seed-based boost for natural energy without the crash.', word: 'Ignite' },
]

const emojis = ['🌾', '🥜', '🌰']
const step = (Math.PI * 2) / slides.length

export default function OrbitSlider() {
  const [active, setActive] = useState(0)
  const visualRef = useRef(null)
  const orbitRingRef = useRef(null)
  const productRef = useRef(null)
  const productImgRef = useRef(null)
  const mainWordRef = useRef(null)
  const descRef = useRef(null)
  const itemsRef = useRef([])
  const rotationRef = useRef(0)
  const autoRef = useRef(null)
  const ingredientRef = useRef([])
  const activeRef = useRef(active)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const getLayout = useCallback(() => {
    if (!visualRef.current) return { cx: 0, cy: 0, r: 0 }
    const w = visualRef.current.clientWidth
    const h = visualRef.current.clientHeight
    return { cx: w / 1.4, cy: h / 1.5, r: Math.min(w, h) * 0.55 }
  }, [])

  const getFocusAngle = useCallback(() => {
    return isMobile ? -Math.PI * 5 / 6 : Math.PI
  }, [isMobile])

  const createSprinkle = useCallback(() => {
    const parent = visualRef.current
    if (!parent || !productRef.current) return

    ingredientRef.current.forEach(el => { try { el.remove() } catch {} })
    ingredientRef.current = []

    const pRect = productRef.current.getBoundingClientRect()
    const vRect = parent.getBoundingClientRect()
    const cx = pRect.left - vRect.left + pRect.width / 2
    const cy = pRect.top - vRect.top + pRect.height / 2

    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div')
      el.innerHTML = emojis[Math.floor(Math.random() * emojis.length)]
      el.style.cssText = `position:absolute;pointer-events:none;user-select:none;z-index:5;font-size:${18 + Math.random() * 18}px;left:${cx}px;top:${cy}px;`
      parent.appendChild(el)
      ingredientRef.current.push(el)
      gsap.to(el, {
        x: (Math.random() * 500) - 300,
        y: (Math.random() * 450) - 275,
        rotation: (Math.random() * 720) - 360,
        duration: 1.2,
        ease: 'power2.out',
      })
    }
  }, [])

  const changeWord = useCallback((idx) => {
    const el = mainWordRef.current
    if (!el) return
    gsap.to(el, {
      opacity: 0, y: -10, duration: 0.2,
      onComplete: () => {
        el.innerText = slides[idx].word
        gsap.to(el, { opacity: 1, y: 0, duration: 0.3 })
      },
    })
  }, [])

  const updateUI = useCallback((idx) => {
    if (descRef.current) descRef.current.innerText = slides[idx].desc
    if (productRef.current) {
      gsap.fromTo(productRef.current,
        { rotation: -15, transformOrigin: 'center center' },
        { rotation: 0, duration: 0.8, ease: 'power3.out' }
      )
    }
    createSprinkle()
    if (productImgRef.current) {
      gsap.to(productImgRef.current, {
        opacity: 0, duration: 0.2,
        onComplete: () => {
          productImgRef.current.src = slides[idx].img
          gsap.to(productImgRef.current, { opacity: 1, duration: 0.4 })
        },
      })
    }
    changeWord(idx)
  }, [createSprinkle, changeWord])

  const positionItems = useCallback(() => {
    const { cx, cy, r } = getLayout()
    const rot = rotationRef.current
    const currentActive = activeRef.current

    if (orbitRingRef.current) {
      gsap.set(orbitRingRef.current, {
        width: r * 2, height: r * 2, left: cx - r, top: cy - r,
      })
    }

    const m = window.innerWidth <= 1024
    const pw = m ? 160 : 220
    const ph = m ? 220 : 300
    if (productRef.current) {
      gsap.set(productRef.current, {
        width: pw, height: ph,
        left: cx - pw / 2, top: cy - ph / 2,
      })
    }

    slides.forEach((_, i) => {
      const angle = (i * step) + rot
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      const depth = (Math.sin(angle) + 1) / 2
      const isActiveItem = i === currentActive
      const size = isActiveItem ? (m ? 140 : 170) : (55 + depth * 60)

      const el = itemsRef.current[i]
      if (el) {
        gsap.to(el, {
          x: x - size / 2, y: y - size / 2,
          width: size, height: size,
          opacity: isActiveItem ? 1 : 0.25 + depth * 0.4,
          duration: 0.7,
          ease: 'power3.out',
        })
        el.style.zIndex = isActiveItem ? 999 : Math.floor(depth * 100)
        el.style.border = isActiveItem ? '3px solid #8d00a8' : 'none'
      }
    })
  }, [getLayout])

  const goTo = useCallback((idx) => {
    const nextIdx = ((idx % slides.length) + slides.length) % slides.length
    const focus = getFocusAngle()
    rotationRef.current = focus - (nextIdx * step)

    activeRef.current = nextIdx
    setActive(nextIdx)
    updateUI(nextIdx)
    positionItems()
  }, [getFocusAngle, updateUI, positionItems])

  // Directional handlers — rotate the full orbit by ±step
  const rotate = useCallback((direction) => {
    rotationRef.current += direction * step
    const focus = getFocusAngle()
    const unwrapped = (focus - rotationRef.current) / step
    const nextIdx = ((Math.round(unwrapped) % slides.length) + slides.length) % slides.length

    activeRef.current = nextIdx
    setActive(nextIdx)
    updateUI(nextIdx)
    positionItems()
  }, [getFocusAngle, updateUI, positionItems])

  const next = useCallback(() => {
    rotate(-1)  // anticlockwise
    resetAuto()
  }, [rotate])

  const prev = useCallback(() => {
    rotate(1)   // clockwise
    resetAuto()
  }, [rotate])

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      rotate(-1)
    }, 4000)
  }, [rotate])

  // Initial render on mount
  useEffect(() => {
    const focus = getFocusAngle()
    rotationRef.current = focus
    updateUI(0)
    positionItems()
  }, [getFocusAngle, updateUI, positionItems])

  // Auto rotation
  useEffect(() => {
    resetAuto()
    const onResize = () => positionItems()
    window.addEventListener('resize', onResize)
    return () => {
      if (autoRef.current) clearInterval(autoRef.current)
      window.removeEventListener('resize', onResize)
      ingredientRef.current.forEach(el => { try { el.remove() } catch {} })
    }
  }, [resetAuto, positionItems])

  const navbarH = isMobile ? 80 : 70

  return (
    <div style={{
      width: '100%',
      height: `calc(100vh - ${navbarH}px)`,
      marginTop: `${navbarH}px`,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      background: 'radial-gradient(circle at 20% 20%, #fff 0%, #f3e8ff 40%, #e6d3ff 100%)',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
    }}>
      <div style={{
        width: isMobile ? '100%' : '45%',
        maxHeight: isMobile ? '30vh' : '100%',
        padding: isMobile ? '12px 16px' : '90px 70px',
        textAlign: isMobile ? 'center' : 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <h1 style={{ fontSize: isMobile ? '32px' : '70px', lineHeight: 1, margin: 0 }}>
          <span ref={mainWordRef} style={{ color: '#8d00a8' }}>Charge</span><br />
          With Hyper Bite
        </h1>
        <p ref={descRef} style={{
          marginTop: isMobile ? '8px' : '20px',
          fontSize: isMobile ? '13px' : '20px',
          lineHeight: 1.4,
          maxWidth: isMobile ? '90%' : '500px',
          color: '#333',
          alignSelf: isMobile ? 'center' : 'flex-start',
        }}>
          {slides[0].desc}
        </p>
      </div>

      <div ref={visualRef} style={{
        flex: 1,
        height: isMobile ? '70vh' : '100%',
        position: 'relative',
      }}>
        <div ref={orbitRingRef} style={{
          position: 'absolute', borderRadius: '50%',
          border: '4px solid rgba(140,80,255,.25)',
        }} />

        <div ref={productRef} style={{
          position: 'absolute', borderRadius: '20px', overflow: 'hidden', zIndex: 10,
        }}>
          <img ref={productImgRef}
            src={slides[0].img} alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {slides.map((_, i) => (
          <div key={i} ref={el => itemsRef.current[i] = el} style={{
            position: 'absolute', borderRadius: '50%', overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,.1)',
          }}>
            <img src={slides[i].img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>

      <div style={{
        position: 'fixed',
        left: isMobile ? '50%' : '60px',
        bottom: isMobile ? '16px' : '30px',
        transform: isMobile ? 'translateX(-50%)' : 'none',
        display: 'flex', gap: '10px',
        zIndex: 1000,
      }}>
        <button onClick={prev} style={{
          width: '55px', height: '55px', borderRadius: '50%', border: 'none',
          background: 'white', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,.1)',
          fontSize: '20px', fontWeight: 600, color: '#333',
        }}>←</button>
        <button onClick={next} style={{
          width: '55px', height: '55px', borderRadius: '50%', border: 'none',
          background: 'white', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,.1)',
          fontSize: '20px', fontWeight: 600, color: '#333',
        }}>→</button>
      </div>
    </div>
  )
}
