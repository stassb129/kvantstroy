'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { EASE } from '@/lib/motion'
import {
  portfolioProjects,
  typeLabels,
  type PortfolioProject,
} from '@/lib/portfolio'
import ProjectGalleryModal from '@/components/ProjectGalleryModal'

const projects = portfolioProjects
const LAST = projects.length - 1
/** Pause after last scroll event before snapping to nearest slide. */
const SNAP_DELAY_MS = 220
/** Skip snap if already this close to a whole slide (0–1 of one step). */
const SNAP_EPSILON = 0.035

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/**
 * Desktop: sticky vertical section drives a full-viewport horizontal track
 * with parallax media. Mobile (<768px): stacked vertical slides.
 */
export default function HorizontalPortfolio() {
  const reduceMotion = useReducedMotion()
  const [isMobile, setIsMobile] = useState(false)
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [selected, setSelected] = useState<PortfolioProject | null>(null)

  const sectionRef = useRef<HTMLElement>(null)
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const snapping = useRef(false)
  const reduceMotionRef = useRef(!!reduceMotion)

  useEffect(() => {
    reduceMotionRef.current = !!reduceMotion
  }, [reduceMotion])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const getScrollMetrics = useCallback(() => {
    const el = sectionRef.current
    if (!el) return null
    const total = el.offsetHeight - window.innerHeight
    if (total <= 0) return null
    const rect = el.getBoundingClientRect()
    const scrolled = Math.min(total, Math.max(0, -rect.top))
    const p = scrolled / total
    const sticky = rect.top <= 1 && rect.bottom >= window.innerHeight - 1
    return { el, total, p, sticky }
  }, [])

  const scrollToIndex = useCallback(
    (index: number, behavior?: ScrollBehavior) => {
      const el = sectionRef.current
      if (!el) return
      const clamped = Math.min(LAST, Math.max(0, index))
      const scrollBehavior =
        behavior ?? (reduceMotionRef.current ? 'auto' : 'smooth')

      if (isMobile) {
        const slide = el.querySelector<HTMLElement>(`[data-slide="${clamped}"]`)
        slide?.scrollIntoView({ behavior: scrollBehavior, block: 'start' })
        setActive(clamped)
        return
      }

      const total = el.offsetHeight - window.innerHeight
      if (total <= 0) return
      const top = el.offsetTop + (clamped / LAST) * total
      snapping.current = true
      window.scrollTo({ top, behavior: scrollBehavior })
      setActive(clamped)

      window.setTimeout(
        () => {
          snapping.current = false
        },
        scrollBehavior === 'smooth' ? 700 : 80,
      )
    },
    [isMobile],
  )

  const scheduleSnap = useCallback(() => {
    if (snapTimer.current) clearTimeout(snapTimer.current)
    snapTimer.current = setTimeout(() => {
      if (snapping.current || selected) return
      const metrics = getScrollMetrics()
      if (!metrics?.sticky) return

      const fractional = metrics.p * LAST
      const nearest = Math.round(fractional)
      if (Math.abs(fractional - nearest) < SNAP_EPSILON) return

      scrollToIndex(nearest)
    }, SNAP_DELAY_MS)
  }, [getScrollMetrics, scrollToIndex, selected])

  const updateFromScroll = useCallback(() => {
    const metrics = getScrollMetrics()
    if (!metrics || isMobile) return

    setProgress(metrics.p)
    setActive(Math.round(metrics.p * LAST))

    if (!snapping.current) scheduleSnap()
  }, [getScrollMetrics, isMobile, scheduleSnap])

  useEffect(() => {
    if (isMobile) return
    updateFromScroll()
    window.addEventListener('scroll', updateFromScroll, { passive: true })
    window.addEventListener('resize', updateFromScroll)
    return () => {
      window.removeEventListener('scroll', updateFromScroll)
      window.removeEventListener('resize', updateFromScroll)
      if (snapTimer.current) clearTimeout(snapTimer.current)
    }
  }, [isMobile, updateFromScroll])

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!selected) return
    if (snapTimer.current) clearTimeout(snapTimer.current)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [selected])

  const trackX = useMemo(() => {
    if (reduceMotion) return `-${active * 100}vw`
    return `-${progress * LAST * 100}vw`
  }, [progress, active, reduceMotion])

  const onPagerSelect = useCallback(
    (index: number) => {
      if (snapTimer.current) clearTimeout(snapTimer.current)
      scrollToIndex(index)
    },
    [scrollToIndex],
  )

  if (isMobile) {
    return (
      <>
        <section id="works" ref={sectionRef} className="relative bg-ink">
          {projects.map((project, index) => (
            <MobileSlide
              key={project.id}
              project={project}
              index={index}
              onOpen={() => setSelected(project)}
            />
          ))}
          <MobilePager active={active} onSelect={onPagerSelect} onActiveChange={setActive} />
        </section>
        <ProjectGalleryModal project={selected} onClose={() => setSelected(null)} />
      </>
    )
  }

  return (
    <>
      <section
        id="works"
        ref={sectionRef}
        className="relative bg-ink"
        style={{ height: `${projects.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div
            className="flex h-full will-change-transform"
            style={{
              width: `${projects.length * 100}vw`,
              transform: `translate3d(${trackX}, 0, 0)`,
              transition: reduceMotion ? 'transform 0.35s ease' : undefined,
            }}
          >
            {projects.map((project, index) => {
              const slideOffset = progress * LAST - index
              return (
                <DesktopSlide
                  key={project.id}
                  project={project}
                  index={index}
                  active={active === index}
                  slideOffset={slideOffset}
                  reduceMotion={!!reduceMotion}
                  onOpen={() => setSelected(project)}
                />
              )
            })}
          </div>

          <DesktopPager active={active} onSelect={onPagerSelect} />
        </div>
      </section>

      <ProjectGalleryModal project={selected} onClose={() => setSelected(null)} />
    </>
  )
}

function DesktopSlide({
  project,
  index,
  active,
  slideOffset,
  reduceMotion,
  onOpen,
}: {
  project: PortfolioProject
  index: number
  active: boolean
  slideOffset: number
  reduceMotion: boolean
  onOpen: () => void
}) {
  // Parallax: media lags behind slide motion (~10% of offset)
  const parallaxX = reduceMotion ? 0 : slideOffset * -10

  return (
    <article className="relative h-screen w-screen shrink-0 overflow-hidden bg-ink">
      <div
        aria-hidden
        className="absolute inset-[-8%] will-change-transform"
        style={{ transform: `translate3d(${parallaxX}%, 0, 0) scale(1.12)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt=""
          className="h-full w-full object-cover opacity-55"
          draggable={false}
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${project.tone} mix-blend-multiply opacity-70`} />
      </div>

      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(105deg,rgba(26,26,26,0.92)_0%,rgba(26,26,26,0.55)_48%,rgba(26,26,26,0.78)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(232,106,0,0.18),transparent_55%)]"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute -right-4 bottom-[-8%] select-none text-[42vw] font-black leading-none text-white/[0.05] sm:text-[28vw]"
      >
        {pad(index + 1)}
      </span>

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-28 pt-28 sm:px-10 lg:justify-center lg:px-16 xl:px-24 lg:pb-20">
        <motion.div
          animate={
            active
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: reduceMotion ? 0 : 50 }
          }
          transition={{ duration: 0.55, ease: EASE }}
          className="max-w-2xl"
        >
          <span className="section-label">
            <span className="h-px w-10 bg-accent" />
            {typeLabels[project.type]}
          </span>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.28em] text-accent">
            {project.subtitle}
          </p>

          <h2 className="mt-3 text-balance text-4xl font-black uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            {project.title}
          </h2>

          <p className="mt-5 max-w-lg text-sm font-light leading-relaxed text-white/60 sm:text-base">
            {project.description}
          </p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/10 pt-6 text-sm">
            {project.area && (
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Площадь</dt>
                <dd className="mt-1 font-semibold text-white/85">{project.area}</dd>
              </div>
            )}
            {project.duration && (
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Срок</dt>
                <dd className="mt-1 font-semibold text-white/85">{project.duration}</dd>
              </div>
            )}
            {project.date && (
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Дата</dt>
                <dd className="mt-1 font-semibold text-white/85">{project.date}</dd>
              </div>
            )}
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Объект</dt>
              <dd className="mt-1 font-semibold text-white/85">{project.subtitle}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={onOpen}
            className="btn-accent group mt-8"
          >
            Подробнее
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </motion.div>
      </div>
    </article>
  )
}

function MobileSlide({
  project,
  index,
  onOpen,
}: {
  project: PortfolioProject
  index: number
  onOpen: () => void
}) {
  return (
    <article
      data-slide={index}
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden border-b border-white/10 bg-ink px-5 pb-24 pt-28 sm:px-8"
    >
      <div aria-hidden className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.image} alt="" className="h-full w-full object-cover opacity-50" />
        <div className={`absolute inset-0 bg-gradient-to-br ${project.tone} mix-blend-multiply opacity-70`} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-16 select-none text-[40vw] font-black leading-none text-white/[0.05]"
      >
        {pad(index + 1)}
      </span>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative z-10 max-w-xl"
      >
        <span className="section-label">
          <span className="h-px w-8 bg-accent" />
          {typeLabels[project.type]}
        </span>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.28em] text-accent">{project.subtitle}</p>
        <h2 className="mt-2 text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
          {project.title}
        </h2>
        <p className="mt-4 text-sm font-light leading-relaxed text-white/60">{project.description}</p>
        <p className="mt-4 text-sm font-medium text-white/50">
          {[project.area, project.duration, project.date].filter(Boolean).join(' · ')}
        </p>
        <button type="button" onClick={onOpen} className="btn-accent group mt-7">
          Подробнее
          <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </motion.div>
    </article>
  )
}

function DesktopPager({
  active,
  onSelect,
}: {
  active: number
  onSelect: (index: number) => void
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-6 px-6 pb-8 sm:px-10 lg:px-16 xl:px-24">
      <div className="pointer-events-auto flex items-center gap-4">
        <span className="font-mono text-sm font-bold tracking-wider text-white/90">
          <span className="text-accent">{pad(active + 1)}</span>
          <span className="text-white/35"> / {pad(projects.length)}</span>
        </span>
        <div className="hidden h-px w-16 bg-white/15 sm:block" />
        <span className="hidden text-[11px] font-medium uppercase tracking-[0.22em] text-white/40 sm:inline">
          Прокрутите вниз
        </span>
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            aria-label={`Перейти к проекту ${pad(index + 1)}`}
            aria-current={active === index ? 'true' : undefined}
            onClick={() => onSelect(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              active === index ? 'w-10 bg-accent' : 'w-3 bg-white/25 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function MobilePager({
  active,
  onSelect,
  onActiveChange,
}: {
  active: number
  onSelect: (index: number) => void
  onActiveChange: (index: number) => void
}) {
  useEffect(() => {
    const slides = document.querySelectorAll<HTMLElement>('[data-slide]')
    if (!slides.length) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const idx = Number((visible.target as HTMLElement).dataset.slide)
        if (!Number.isNaN(idx)) onActiveChange(idx)
      },
      { threshold: [0.45, 0.6] },
    )

    slides.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [onActiveChange])

  return (
    <div className="pointer-events-none fixed bottom-5 left-0 right-0 z-30 flex justify-center px-4 md:hidden">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-ink/80 px-4 py-2.5 backdrop-blur-md">
        <span className="text-xs font-bold tracking-wider">
          <span className="text-accent">{pad(active + 1)}</span>
          <span className="text-white/35"> / {pad(projects.length)}</span>
        </span>
        <div className="flex gap-1.5">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Проект ${pad(i + 1)}`}
              onClick={() => onSelect(i)}
              className={`h-1.5 rounded-full transition-all ${
                active === i ? 'w-6 bg-accent' : 'w-2 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
