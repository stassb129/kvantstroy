'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  /** Starting handle position, 0–100. */
  initial?: number
  beforeLabel?: string
  afterLabel?: string
  beforeSrc?: string
  afterSrc?: string
  className?: string
}

/**
 * Drag-to-compare slider. Built with absolute positioning + clip-path so it works
 * with plain <img> placeholders and needs no external dependency.
 * Moves only while the pointer is pressed; position is lerped for a soft feel.
 */
export default function BeforeAfterSlider({
  initial = 50,
  beforeLabel = 'ДО',
  afterLabel = 'ПОСЛЕ',
  beforeSrc,
  afterSrc,
  className = '',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef(initial)
  const displayRef = useRef(initial)
  const rafRef = useRef<number | null>(null)
  const [position, setPosition] = useState(initial)
  const [dragging, setDragging] = useState(false)

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  /** Ease display toward target; stop the loop when close enough. */
  const startLoop = useCallback(() => {
    if (rafRef.current != null) return

    const tick = () => {
      const target = targetRef.current
      const current = displayRef.current
      // Higher factor = snappier; 0.14 keeps a soft trail without feeling laggy.
      const next = current + (target - current) * 0.14

      if (Math.abs(target - next) < 0.04) {
        displayRef.current = target
        setPosition(target)
        rafRef.current = null
        return
      }

      displayRef.current = next
      setPosition(next)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const setTargetFromClientX = useCallback(
    (clientX: number) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const pct = ((clientX - rect.left) / rect.width) * 100
      targetRef.current = Math.min(100, Math.max(0, pct))
      startLoop()
    },
    [startLoop],
  )

  // Pointer events are tracked on window so the drag survives leaving the element.
  useEffect(() => {
    if (!dragging) return

    const onMove = (e: PointerEvent) => {
      e.preventDefault()
      setTargetFromClientX(e.clientX)
    }
    const onUp = () => setDragging(false)

    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragging, setTargetFromClientX])

  useEffect(() => () => stopLoop(), [stopLoop])

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      targetRef.current = Math.max(0, targetRef.current - step)
      startLoop()
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      targetRef.current = Math.min(100, targetRef.current + step)
      startLoop()
    }
    if (e.key === 'Home') {
      targetRef.current = 0
      startLoop()
    }
    if (e.key === 'End') {
      targetRef.current = 100
      startLoop()
    }
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={(e) => {
        // Ignore right/middle clicks; start drag only on primary button.
        if (e.button !== 0) return
        setDragging(true)
        setTargetFromClientX(e.clientX)
      }}
      className={`group relative h-full w-full cursor-ew-resize select-none overflow-hidden rounded-3xl border border-white/10 bg-ink-700 touch-none ${className}`}
    >
      {/* AFTER — bottom layer, fully visible */}
      <div className="absolute inset-0">
        {afterSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={afterSrc} alt={afterLabel} className="h-full w-full object-cover" draggable={false} />
        ) : (
          <PlaceholderPane variant="after" label={afterLabel} />
        )}
      </div>

      {/* BEFORE — top layer, clipped to the handle position */}
      <div
        className="absolute inset-0 will-change-[clip-path]"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {beforeSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={beforeSrc} alt={beforeLabel} className="h-full w-full object-cover" draggable={false} />
        ) : (
          <PlaceholderPane variant="before" label={beforeLabel} />
        )}
      </div>

      {/* Corner badges */}
      <span className="pointer-events-none absolute left-5 top-5 rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute right-5 top-5 rounded-full border border-accent/40 bg-accent/25 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
        {afterLabel}
      </span>

      {/* Handle */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white/90 shadow-[0_0_24px_rgba(255,255,255,0.5)] will-change-[left]"
        style={{ left: `${position}%` }}
      >
        <motion.button
          type="button"
          role="slider"
          aria-label="Сравнить результат до и после"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          tabIndex={0}
          onKeyDown={onKeyDown}
          animate={{ scale: dragging ? 1.12 : 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="pointer-events-auto absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-accent text-white shadow-accent outline-none focus-visible:ring-4 focus-visible:ring-white/40"
        >
          <ChevronLeft size={16} className="-mr-0.5" />
          <ChevronRight size={16} className="-ml-0.5" />
        </motion.button>
      </div>

      <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.2em] text-white/50 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
        Потяните ползунок
      </span>
    </div>
  )
}

function PlaceholderPane({ variant, label }: { variant: 'before' | 'after'; label: string }) {
  const isAfter = variant === 'after'
  return (
    <div
      className={`flex h-full w-full items-center px-8 sm:px-14 ${
        isAfter
          ? 'justify-end bg-[linear-gradient(135deg,#8A4308_0%,#E86A00_45%,#FFB067_100%)]'
          : 'justify-start bg-[linear-gradient(135deg,#2A2A2A_0%,#4A4A4A_50%,#333333_100%)]'
      }`}
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: isAfter
            ? 'repeating-linear-gradient(115deg, rgba(255,255,255,0.16) 0 2px, transparent 2px 26px)'
            : 'repeating-linear-gradient(45deg, rgba(0,0,0,0.35) 0 6px, transparent 6px 14px)',
        }}
      />
      <span
        className={`relative whitespace-nowrap text-4xl font-black uppercase tracking-[0.18em] sm:text-6xl ${
          isAfter ? 'text-white/85' : 'text-white/30'
        }`}
      >
        {label}
      </span>
    </div>
  )
}
