import React, { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { orbitSliderConfig as products } from '../config/orbitSliderConfig'

const allOrbitItems = products.flatMap((p, productIdx) =>
  p.orbitImages.map(img => ({ productIdx, img }))
)
const step = (Math.PI * 2) / products.length

function productBaseIndex(productIdx) {
  let idx = 0
  for (let i = 0; i < productIdx; i++) {
    idx += products[i].orbitImages.length
  }
  return idx
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
    const rot = rotationRef.current
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

    products.forEach((p, productIdx) => {
      const baseIdx = productBaseIndex(productIdx)
      const itemsPerProduct = p.orbitImages.length

      for (let offset = 0; offset < itemsPerProduct; offset++) {
        const orbitIdx = baseIdx + offset
        const angle = (orbitIdx * step) + rot
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        const depth = (Math.sin(angle) + 1) / 2
        const isActiveItem = productIdx === currentActive && offset === 0
        const size = isActiveItem ? (m ? 140 : 170) : (55 + depth * 60)

        const el = itemsRef.current[orbitIdx]
        if (el) {
          gsap.to(el, {
            x: x - size / 2, y: y - size / 2,
            width: size, height: size,
            opacity: isActiveItem ? 1 : 0.25 + depth * 0.4,
            duration: 0.7,
            ease: 'power3.out',
          })
          el.style.zIndex = isActiveItem ? 999 : Math.floor(depth * 100)
          el.style.border = isActiveItem ? `3px solid ${products[currentActive].accentColor}` : 'none'
        }
      }
    })
  }, [getLayout])

  const goTo = useCallback((idx) => {
    const nextIdx = ((idx % products.length) + products.length) % products.length
    const focus = getFocusAngle()
    const baseIdx = productBaseIndex(nextIdx)
    rotationRef.current = focus - (baseIdx * step)

    activeRef.current = nextIdx
    setActive(nextIdx)
    updateUI(nextIdx)
    positionItems()
  }, [getFocusAngle, updateUI, positionItems])

  const rotate = useCallback((direction) => {
    const currentProduct = activeRef.current
    const itemsPerProduct = products[currentProduct].orbitImages.length
    rotationRef.current += direction * step * itemsPerProduct

    const focus = getFocusAngle()
    const unwrapped = (focus - rotationRef.current) / step
    const nextIdx = ((Math.round(unwrapped) % products.length) + products.length) % products.length

    activeRef.current = nextIdx
    setActive(nextIdx)
    updateUI(nextIdx)
    positionItems()
  }, [getFocusAngle, updateUI, positionItems])

  const next = useCallback(() => {
    rotate(-1)
    resetAuto()
  }, [rotate])

  const prev = useCallback(() => {
    rotate(1)
    resetAuto()
  }, [rotate])

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      rotate(-1)
    }, 4000)
  }, [rotate])

  useEffect(() => {
    const focus = getFocusAngle()
    const baseIdx = productBaseIndex(0)
    rotationRef.current = focus - (baseIdx * step)
    updateUI(0)
    positionItems()
  }, [getFocusAngle, updateUI, positionItems])

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
      // height: `calc(100vh - ${navbarH}px)`,
      height: `calc(100vh )`,
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
        <h1 style={{ fontSize: isMobile ? '32px' : '90px', lineHeight: 1, margin: 0 }}>
          <span className="font-bold" ref={mainWordRef} style={{ color: products[0].accentColor }}>{products[0].word}</span><br />
          With Hyper Bite
        </h1>
        <p ref={descRef} style={{
          marginTop: isMobile ? '8px' : '20px',
          fontSize: isMobile ? '13px' : '20px',
          lineHeight: 1.4,
          maxWidth: isMobile ? '90%' : '500px',
          color: products[0].textColor,
          alignSelf: isMobile ? 'center' : 'flex-start',
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
