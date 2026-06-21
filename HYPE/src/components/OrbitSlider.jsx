import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { gsap } from 'gsap'
import { orbitSliderConfig as products } from '../config/orbitSliderConfig'

const n = products.length

const desktopSlots = [Math.PI, (11 * Math.PI) / 12, (5 * Math.PI) / 6, (3 * Math.PI) / 4, (2 * Math.PI) / 3]
const mobileSlots = [(5 * Math.PI) / 6, (19 * Math.PI) / 24, (3 * Math.PI) / 4, (2 * Math.PI) / 3, (5 * Math.PI) / 8]

const allOrbitItems = products.flatMap((p, productIdx) =>
  p.orbitImages.map(img => ({ productIdx, img }))
)

function productOrbitCount(productIdx) {
  return products[productIdx].orbitImages.length
}

export default function OrbitSlider() {
  const [active, setActive] = useState(0)
  const visualRef = useRef(null)
  const orbitRingRef = useRef(null)
  const productRef = useRef(null)
  const productImgRef = useRef(null)
  const mainWordRef = useRef(null)
  const descRef = useRef(null)
  const itemsRef = useRef([])
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

  const slotAngles = useMemo(() => isMobile ? mobileSlots : desktopSlots, [isMobile])

  const getLayout = useCallback(() => {
    if (!visualRef.current) return { cx: 0, cy: 0, r: 0 }
    const w = visualRef.current.clientWidth
    const h = visualRef.current.clientHeight
    return { cx: w / 1.4, cy: h / 1.5, r: Math.min(w, h) * 0.55 }
  }, [])

  const createSprinkle = useCallback((productIdx) => {
    const parent = visualRef.current
    if (!parent || !productRef.current) return

    ingredientRef.current.forEach(el => { try { el.remove() } catch {} })
    ingredientRef.current = []

    const pRect = productRef.current.getBoundingClientRect()
    const vRect = parent.getBoundingClientRect()
    const cx = pRect.left - vRect.left + pRect.width / 2
    const cy = pRect.top - vRect.top + pRect.height / 2

    const emojiPool = products[productIdx].ingredients
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div')
      el.innerHTML = emojiPool[Math.floor(Math.random() * emojiPool.length)]
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
        el.innerText = products[idx].word
        el.style.color = products[idx].accentColor
        gsap.to(el, { opacity: 1, y: 0, duration: 0.3 })
      },
    })
  }, [])

  const updateUI = useCallback((idx) => {
    const p = products[idx]
    if (descRef.current) {
      descRef.current.innerText = p.tagline
      descRef.current.style.color = p.textColor
    }
    if (productRef.current) {
      gsap.fromTo(productRef.current,
        { rotation: -15, transformOrigin: 'center center' },
        { rotation: 0, duration: 0.8, ease: 'power3.out' }
      )
    }
    createSprinkle(idx)
    if (productImgRef.current) {
      gsap.to(productImgRef.current, {
        opacity: 0, duration: 0.2,
        onComplete: () => {
          productImgRef.current.src = p.productImage
          gsap.to(productImgRef.current, { opacity: 1, duration: 0.4 })
        },
      })
    }
    changeWord(idx)
  }, [createSprinkle, changeWord])

  const positionItems = useCallback(() => {
    const { cx, cy, r } = getLayout()
    const currentActive = activeRef.current

    if (orbitRingRef.current) {
      gsap.set(orbitRingRef.current, {
        width: r * 2, height: r * 2, left: cx - r, top: cy - r,
        borderColor: products[currentActive].orbitColor,
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

    function hourAngle(h) {
      return Math.PI / 2 - (h % 12) * (Math.PI / 6)
    }

    const activeCount = productOrbitCount(currentActive)
    const activeHours = []
    for (let i = 0; i < activeCount; i++) {
      activeHours.push(activeCount === 1 ? 9 : 9 + (i / (activeCount - 1)) * 3)
    }

    const inactiveProductIndices = products
      .map((_, i) => i)
      .filter(i => i !== currentActive)

    const inactiveHours = []
    for (let i = 0; i < inactiveProductIndices.length; i++) {
      inactiveHours.push(1 + (i / (inactiveProductIndices.length - 1 || 1)) * 7)
    }

    const maxSize = m ? 140 : 170
    const gap = m ? 12 : 18

    let globalIdx = 0
    products.forEach((p, productIdx) => {
      const count = productOrbitCount(productIdx)
      const isActive = productIdx === currentActive

      for (let offset = 0; offset < count; offset++) {
        const el = itemsRef.current[globalIdx]
        if (!el) { globalIdx++; continue }

        if (offset === 0 || isActive) {
          const hour = isActive ? activeHours[offset] : inactiveHours[inactiveProductIndices.indexOf(productIdx)]
          const angle = hourAngle(hour)
          const isFocus = isActive && offset === 0
          const isActiveOther = isActive && offset > 0

          const size = isFocus ? maxSize : (isActiveOther ? maxSize * 0.55 : m ? 30 : 40)
          const x = cx + r * Math.cos(angle)
          const y = cy - r * Math.sin(angle)

          gsap.to(el, {
            x: x - size / 2, y: y - size / 2,
            width: size, height: size,
            opacity: isFocus ? 1 : (isActiveOther ? 0.85 : 0.5),
            duration: 0.7,
            ease: 'power3.out',
          })
          el.style.zIndex = isFocus ? 999 : (isActiveOther ? 800 - offset : 500 - hour)
          el.style.border = isFocus ? `3px solid ${products[currentActive].accentColor}` : 'none'
        } else {
          const hideHour = inactiveHours[inactiveProductIndices.indexOf(productIdx)] || 1
          const hideAngle = hourAngle(hideHour)
          const x0 = cx + r * Math.cos(hideAngle)
          const y0 = cy - r * Math.sin(hideAngle)
          gsap.to(el, {
            x: x0, y: y0,
            width: 0, height: 0,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
          })
        }
        globalIdx++
      }
    })
  }, [getLayout])

  const goTo = useCallback((idx) => {
    const nextIdx = ((idx % n) + n) % n
    activeRef.current = nextIdx
    setActive(nextIdx)
    updateUI(nextIdx)
    positionItems()
  }, [updateUI, positionItems])

  const next = useCallback(() => {
    const nextIdx = (activeRef.current + 1) % n
    activeRef.current = nextIdx
    setActive(nextIdx)
    updateUI(nextIdx)
    positionItems()
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      const ni = (activeRef.current + 1) % n
      activeRef.current = ni
      setActive(ni)
      updateUI(ni)
      positionItems()
    }, 4000)
  }, [updateUI, positionItems])

  const prev = useCallback(() => {
    const nextIdx = ((activeRef.current - 1) % n + n) % n
    activeRef.current = nextIdx
    setActive(nextIdx)
    updateUI(nextIdx)
    positionItems()
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      const ni = (activeRef.current + 1) % n
      activeRef.current = ni
      setActive(ni)
      updateUI(ni)
      positionItems()
    }, 4000)
  }, [updateUI, positionItems])

  useEffect(() => {
    updateUI(0)
    positionItems()
    autoRef.current = setInterval(() => {
      const ni = (activeRef.current + 1) % n
      activeRef.current = ni
      setActive(ni)
      updateUI(ni)
      positionItems()
    }, 4000)
    const onResize = () => positionItems()
    window.addEventListener('resize', onResize)
    return () => {
      if (autoRef.current) clearInterval(autoRef.current)
      window.removeEventListener('resize', onResize)
      ingredientRef.current.forEach(el => { try { el.remove() } catch {} })
    }
  }, [updateUI, positionItems])

  const navbarH = isMobile ? 80 : 70

  return (
    <div style={{
      width: '100%',
      height: `calc(100vh)`,
      paddingTop: `${navbarH}px`,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      background: products[active].background,
      fontFamily: "'Istok Web', sans-serif",
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
        <h1 style={{ fontSize: isMobile ? '32px' : '90px', lineHeight: 1, margin: 0, fontFamily: "'Istok Web', sans-serif" }}>
          <span className="font-bold" ref={mainWordRef} style={{ color: products[0].accentColor, fontFamily: "'Istok Web', sans-serif" }}>{products[0].word}</span><br />
          With Hyper Bite
        </h1>
        <p ref={descRef} style={{
          marginTop: isMobile ? '8px' : '20px',
          fontSize: isMobile ? '13px' : '20px',
          lineHeight: 1.4,
          maxWidth: isMobile ? '90%' : '500px',
          color: products[0].textColor,
          alignSelf: isMobile ? 'center' : 'flex-start',
          fontFamily: "'Istok Web', sans-serif",
        }}>
          {products[0].tagline}
        </p>
      </div>

      <div ref={visualRef} style={{
        flex: 1,
        height: isMobile ? '70vh' : '100%',
        position: 'relative',
      }}>
        <div ref={orbitRingRef} style={{
          position: 'absolute', borderRadius: '50%',
          border: `4px solid ${products[active].orbitColor}`,
        }} />

        <div ref={productRef} style={{
          position: 'absolute', borderRadius: '20px', overflow: 'hidden', zIndex: 10,
        }}>
          <img ref={productImgRef}
            src={products[0].productImage} alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {allOrbitItems.map((item, i) => (
          <div key={i} ref={el => itemsRef.current[i] = el} style={{
            position: 'absolute', borderRadius: '50%', overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,.1)',
          }}>
            <img src={item.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
