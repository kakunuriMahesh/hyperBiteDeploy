import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { gsap } from 'gsap'
import { orbitSliderConfig as products, orbitSvgImage } from '../config/orbitSliderConfig'

const n = products.length
const orbitStep = (2 * Math.PI) / n

const allOrbitItems = products.flatMap((p, productIdx) =>
  p.orbitImages.map(img => ({ productIdx, img }))
)

function productOrbitCount(productIdx) {
  return products[productIdx].orbitImages.length
}

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255
  let g = parseInt(hex.slice(3, 5), 16) / 255
  let b = parseInt(hex.slice(5, 7), 16) / 255
  let max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
    h *= 360
  }
  return { h, s: s * 100, l: l * 100 }
}

function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100
  let a = s * Math.min(l, 1 - l)
  let f = n => {
    let k = (n + h * 12) % 12
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1))).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

const dynamicColors = [
  '#F5EBFA', '#A47FB5', '#875CA0', '#7C4B99', '#6B3188',
  '#956EA9', '#BE99CE', '#E8DDEB', '#BCAAB1', '#D2C3CA', '#F2E6F7', '#DBC1E8',
]

function applyProductPalette(svg, product) {
  const accentHsl = hexToHsl(product.accentColor)
  const targetHue = accentHsl.h
  let result = svg.replace('width="1560" height="1604"', '')
  for (const orig of dynamicColors) {
    const hsl = hexToHsl(orig)
    if (hsl.s < 5) continue
    let diff = targetHue - hsl.h
    if (diff > 180) diff -= 360
    if (diff < -180) diff += 360
    const newHsl = {
      h: ((hsl.h + diff) % 360 + 360) % 360,
      s: hsl.s,
      l: hsl.l,
    }
    result = result.replaceAll(orig, hslToHex(newHsl.h, newHsl.s, newHsl.l))
  }
  return result
}

export default function OrbitSlider() {
  const [active, setActive] = useState(0)
  const visualRef = useRef(null)
  const orbitRingRef = useRef(null)
  const orbitSvgRef = useRef(null)
  const productRef = useRef(null)
  const productImgRef = useRef(null)
  const mainWordRef = useRef(null)
  const descRef = useRef(null)
  const itemsRef = useRef([])
  const autoRef = useRef(null)
  const ingredientRef = useRef([])
  const activeRef = useRef(active)
  const rotationRef = useRef(0)
  const prevRotRef = useRef(0)
  const totalActiveRef = useRef(0)
  const tweenRef = useRef(null)

  const [isMobile, setIsMobile] = useState(false)

  const processedSvg = useMemo(() => applyProductPalette(orbitSvgImage, products[active]), [active])

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
    const active = activeRef.current
    const targetRot = rotationRef.current
    const fromRot = prevRotRef.current

    if (orbitRingRef.current) {
      gsap.set(orbitRingRef.current, {
        width: r * 2, height: r * 2, left: cx - r, top: cy - r,
        borderColor: products[active].orbitColor,
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

    const slotHours = [9, 12, 10 / 3, 17 / 3, 8]

    function interpolateSlotHour(slot) {
      const nSlots = slotHours.length
      const from = Math.ceil(slot) % nSlots
      const to = Math.floor(slot)
      const hFrom = slotHours[from]
      const hTo = slotHours[to < 0 ? nSlots - 1 : to]
      const t = 1 - (slot - Math.floor(slot))
      let diff = hTo - hFrom
      if (diff > 0) diff -= 12
      let hour = hFrom + diff * t
      if (hour < 0) hour += 12
      if (hour >= 12) hour -= 12
      return hour
    }

    const maxSize = m ? 110 : 170
    const minSize = m ? 30 : 40

    function renderAll(rot) {
      const floatActive = rot / orbitStep
      const visualActive = Math.round(floatActive) % n
      let idx = 0
      products.forEach((p, productIdx) => {
        const count = productOrbitCount(productIdx)
        const isActive = productIdx === visualActive
        const slot = ((productIdx - floatActive) % n + n) % n
        const hour = interpolateSlotHour(slot)
        const angle = hourAngle(hour)
        const depth = (1 - Math.cos(angle)) / 2

        for (let offset = 0; offset < count; offset++) {
          const el = itemsRef.current[idx]
          if (!el) { idx++; continue }

          let size, x, y, op

          if (isActive && offset > 0) {
            const extraAngle = hourAngle(9 + (offset / (count - 1)) * 2)
            size = maxSize
            x = cx + r * Math.cos(extraAngle) - size / 2
            y = cy - r * Math.sin(extraAngle) - size / 2
            op = 0.85
            el.style.zIndex = 800 - offset
            el.style.border = `2px solid ${products[visualActive].accentColor}`
          } else if (isActive) {
            size = maxSize
            x = cx + r * Math.cos(angle) - size / 2
            y = cy - r * Math.sin(angle) - size / 2
            op = 1
            el.style.zIndex = 999
            el.style.border = `3px solid ${products[visualActive].accentColor}`
          } else if (offset === 0) {
            size = minSize + depth * (maxSize - minSize) * 0.6
            x = cx + r * Math.cos(angle) - size / 2
            y = cy - r * Math.sin(angle) - size / 2
            op = 0.25 + depth * 0.5
            el.style.zIndex = Math.floor(depth * 100)
            el.style.border = 'none'
          } else {
            size = 0
            x = cx + r * Math.cos(angle)
            y = cy - r * Math.sin(angle)
            op = 0
          }

          el.style.transform = `translate(${x}px, ${y}px)`
          el.style.width = `${size}px`
          el.style.height = `${size}px`
          el.style.opacity = op
          idx++
        }
      })
      if (orbitSvgRef.current) {
        orbitSvgRef.current.style.transform = `rotate(${-rot}rad)`
      }
    }

    if (Math.abs(targetRot - fromRot) < 0.0001) {
      renderAll(targetRot)
      return
    }

    if (tweenRef.current) tweenRef.current.kill()
    const state = { rot: fromRot }
    tweenRef.current = gsap.to(state, {
      rot: targetRot,
      duration: 0.7,
      ease: 'power3.out',
      onUpdate: () => renderAll(state.rot),
      onComplete: () => { prevRotRef.current = targetRot }
    })
  }, [getLayout])

  const goTo = useCallback((idx) => {
    const clamped = ((idx % n) + n) % n
    const current = ((activeRef.current % n) + n) % n
    let diff = ((clamped - current) % n + n) % n
    if (diff === 0) return
    if (diff > n / 2) diff -= n

    prevRotRef.current = rotationRef.current
    totalActiveRef.current += diff
    activeRef.current = ((totalActiveRef.current % n) + n) % n
    rotationRef.current = totalActiveRef.current * orbitStep
    setActive(activeRef.current)
    updateUI(activeRef.current)
    positionItems()
  }, [updateUI, positionItems])

  const next = useCallback(() => {
    prevRotRef.current = rotationRef.current
    totalActiveRef.current += 1
    activeRef.current = ((totalActiveRef.current % n) + n) % n
    rotationRef.current = totalActiveRef.current * orbitStep
    setActive(activeRef.current)
    updateUI(activeRef.current)
    positionItems()
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      prevRotRef.current = rotationRef.current
      totalActiveRef.current += 1
      activeRef.current = ((totalActiveRef.current % n) + n) % n
      rotationRef.current = totalActiveRef.current * orbitStep
      setActive(activeRef.current)
      updateUI(activeRef.current)
      positionItems()
    }, 4000)
  }, [updateUI, positionItems])

  const prev = useCallback(() => {
    prevRotRef.current = rotationRef.current
    totalActiveRef.current -= 1
    activeRef.current = ((totalActiveRef.current % n) + n) % n
    rotationRef.current = totalActiveRef.current * orbitStep
    setActive(activeRef.current)
    updateUI(activeRef.current)
    positionItems()
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      prevRotRef.current = rotationRef.current
      totalActiveRef.current += 1
      activeRef.current = ((totalActiveRef.current % n) + n) % n
      rotationRef.current = totalActiveRef.current * orbitStep
      setActive(activeRef.current)
      updateUI(activeRef.current)
      positionItems()
    }, 4000)
  }, [updateUI, positionItems])

  useEffect(() => {
    updateUI(0)
    positionItems()
    autoRef.current = setInterval(() => {
      prevRotRef.current = rotationRef.current
      totalActiveRef.current += 1
      activeRef.current = ((totalActiveRef.current % n) + n) % n
      rotationRef.current = totalActiveRef.current * orbitStep
      setActive(activeRef.current)
      updateUI(activeRef.current)
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
          position: 'absolute', borderRadius: '50%', overflow: 'hidden',
          border: `4px solid ${products[active].orbitColor}`,
        }}>
          <div ref={orbitSvgRef}
            dangerouslySetInnerHTML={{ __html: processedSvg }}
            style={{ width: '80%', height: '80%', margin: '10%', pointerEvents: 'none' }}
          />
        </div>

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
