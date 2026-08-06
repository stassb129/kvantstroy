'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/** Soft momentum scrolling for the whole document. */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })

    let raf = 0
    const tick = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    document.documentElement.classList.add('lenis')

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      document.documentElement.classList.remove('lenis')
    }
  }, [])

  return null
}
