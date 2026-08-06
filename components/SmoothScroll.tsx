'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

/** Soft momentum scrolling + reset scroll position on route change. */
export default function SmoothScroll() {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduce.matches) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })
    lenisRef.current = lenis

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
      lenisRef.current = null
      document.documentElement.classList.remove('lenis')
    }
  }, [])

  // Jump to top (or hash target) whenever the route changes.
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''

    const run = () => {
      if (hash) {
        const target = document.querySelector(hash)
        if (target instanceof HTMLElement) {
          lenisRef.current?.scrollTo(target, { immediate: true })
          target.scrollIntoView({ behavior: 'auto', block: 'start' })
          return
        }
      }

      lenisRef.current?.scrollTo(0, { immediate: true })
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    // Wait a frame so the new page layout is in the DOM (and Lenis is ready).
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(run)
    })
    return () => window.cancelAnimationFrame(id)
  }, [pathname])

  return null
}
