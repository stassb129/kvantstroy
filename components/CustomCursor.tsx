'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Decorative hollow ring that eases after the pointer.
 * Soft accent glow; scale eases on hover/click (no snap).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const target = useRef({ x: -100, y: -100 })
  const scale = useRef(1)
  const hovering = useRef(false)
  const pressing = useRef(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setEnabled(fine.matches)
    sync()
    fine.addEventListener('change', sync)
    return () => fine.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
    }

    const onOver = (e: PointerEvent) => {
      const el = e.target as HTMLElement | null
      hovering.current = Boolean(
        el?.closest('a, button, [role="button"], input, textarea, select, label, .cursor-hover'),
      )
    }

    const onDown = () => {
      pressing.current = true
    }
    const onUp = () => {
      pressing.current = false
    }

    let raf = 0
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12
      pos.current.y += (target.current.y - pos.current.y) * 0.12

      const scaleTarget = pressing.current ? 0.7 : hovering.current ? 0.82 : 1
      // Slow ease so shrink/grow never snaps
      scale.current += (scaleTarget - scale.current) * 0.08

      const node = dotRef.current
      if (node) {
        const t = Math.min(1, Math.max(0, (1 - scale.current) / 0.3))
        const glowAlpha = 0.22 + t * 0.35
        const glowSpread = 4 + t * 8

        node.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) scale(${scale.current})`
        node.style.opacity = String(0.75 + t * 0.2)
        node.style.boxShadow = `0 0 ${glowSpread}px 1px rgba(232,106,0,${glowAlpha}), 0 0 ${glowSpread * 2}px ${2 + t * 2}px rgba(255,138,38,${glowAlpha * 0.45})`
        node.style.borderColor = `rgba(232,106,0,${0.55 + t * 0.35})`
      }

      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('pointercancel', onUp, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[200] h-8 w-8 rounded-full border border-accent will-change-transform"
      style={{ opacity: 0 }}
    />
  )
}
