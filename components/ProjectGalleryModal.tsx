'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, X } from 'lucide-react'
import { EASE } from '@/lib/motion'
import { typeLabels, type PortfolioProject } from '@/lib/portfolio'

type Props = {
  project: PortfolioProject | null
  onClose: () => void
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** Wide gallery modal with animated image slider for a portfolio project. */
export default function ProjectGalleryModal({ project, onClose }: Props) {
  return (
    <AnimatePresence>
      {project && <ModalBody key={project.id} project={project} onClose={onClose} />}
    </AnimatePresence>
  )
}

function ModalBody({ project, onClose }: { project: PortfolioProject; onClose: () => void }) {
  const images = project.gallery.length
    ? project.gallery
    : [{ src: project.image, alt: project.title }]
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const goTo = useCallback(
    (next: number, dir?: number) => {
      const len = images.length
      const wrapped = ((next % len) + len) % len
      setDirection(dir ?? (wrapped > index ? 1 : -1))
      setIndex(wrapped)
    },
    [images.length, index],
  )

  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index])
  const next = useCallback(() => goTo(index + 1, 1), [goTo, index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  const current = images[index]
  const specs = [
    { label: 'Площадь', value: project.area },
    { label: 'Срок', value: project.duration },
    { label: 'Дата', value: project.date },
    { label: 'Тип', value: typeLabels[project.type] },
  ].filter((spec): spec is { label: string; value: string } => Boolean(spec.value))

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex items-end justify-center p-0 sm:items-center sm:p-5 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        role="dialog"
        aria-modal
        aria-labelledby="project-modal-title"
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 28, scale: 0.98 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative z-10 flex max-h-[94dvh] w-full max-w-6xl flex-col overflow-hidden rounded-[5px] border border-white/10 bg-ink-800 shadow-glass lg:max-w-7xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-colors hover:border-accent hover:bg-accent lg:right-5 lg:top-5"
        >
          <X size={18} />
        </button>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[1.45fr_1fr]">
          {/* Gallery */}
          <div className="relative flex min-h-[42vh] flex-col bg-black sm:min-h-[48vh] lg:min-h-[min(78vh,720px)]">
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={current.src + index}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: EASE }}
                  className="absolute inset-0"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.12}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -64 || info.velocity.x < -400) next()
                    else if (info.offset.x > 64 || info.velocity.x > 400) prev()
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.src}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full scale-110 select-none object-cover opacity-50 blur-2xl"
                    draggable={false}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.src}
                    alt={current.alt}
                    className="relative h-full w-full select-none object-contain"
                    draggable={false}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25"
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <NavButton side="left" onClick={prev} label="Предыдущее фото" />
                  <NavButton side="right" onClick={next} label="Следующее фото" />
                </>
              )}

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-4 sm:p-5">
                <div className="pointer-events-none">
                  {current.caption && (
                    <motion.p
                      key={current.caption}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80"
                    >
                      {current.caption}
                    </motion.p>
                  )}
                  <p className="mt-1 font-mono text-sm font-bold text-white/90">
                    <span className="text-accent">{pad(index + 1)}</span>
                    <span className="text-white/35"> / {pad(images.length)}</span>
                  </p>
                </div>
              </div>
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto border-t border-white/10 bg-ink-900/80 p-3 no-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={img.src + i}
                    type="button"
                    onClick={() => goTo(i, i > index ? 1 : -1)}
                    aria-label={`Фото ${i + 1}`}
                    aria-current={i === index ? 'true' : undefined}
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-[5px] border-2 transition-all duration-300 sm:h-16 sm:w-24 ${
                      i === index
                        ? 'border-accent shadow-[0_0_0_1px_rgba(232,106,0,0.4)]'
                        : 'border-white/10 opacity-55 hover:opacity-90'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex min-h-0 flex-col overflow-y-auto border-t border-white/10 lg:border-l lg:border-t-0">
            <div className="px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.08 }}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                  {[typeLabels[project.type], project.date].filter(Boolean).join(' · ')}
                </span>
                <h3
                  id="project-modal-title"
                  className="mt-3 text-2xl font-black uppercase leading-tight tracking-tight sm:text-3xl lg:text-4xl"
                >
                  {project.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-white/55 sm:text-base">{project.subtitle}</p>
                <p className="mt-5 text-sm font-light leading-relaxed text-white/65 sm:text-base">
                  {project.description}
                </p>
              </motion.div>

              <motion.dl
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.14 }}
                className="mt-7 grid grid-cols-2 gap-3"
              >
                {specs.map((spec, i) => (
                  <Spec
                    key={spec.label}
                    label={spec.label}
                    value={spec.value}
                    className={i === specs.length - 1 && specs.length % 2 === 1 ? 'col-span-2' : ''}
                  />
                ))}
              </motion.dl>

              <motion.ul
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.2 }}
                className="mt-7 space-y-3"
              >
                {project.details.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/75 sm:text-[15px]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </motion.ul>

              {project.review && (
                <motion.figure
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.24 }}
                  className="mt-8 rounded-[5px] border border-accent/25 bg-accent/[0.06] px-5 py-5"
                >
                  <figcaption className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2 text-accent">
                      <Quote size={14} />
                      Отзыв заказчика
                    </span>
                    <span className="text-white/40">{project.review.date}</span>
                  </figcaption>
                  <blockquote className="mt-3 text-sm font-light leading-relaxed text-white/75">
                    «{project.review.text}»
                  </blockquote>
                </motion.figure>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28 }}
                className="mt-8 hidden text-[11px] font-medium uppercase tracking-[0.18em] text-white/35 lg:block"
              >
                ← → листать фото · Esc закрыть
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '42%' : '-42%',
    opacity: 0,
    scale: 1.04,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-28%' : '28%',
    opacity: 0,
    scale: 0.98,
  }),
}

function NavButton({
  side,
  onClick,
  label,
}: {
  side: 'left' | 'right'
  onClick: () => void
  label: string
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-sm transition-all duration-300 hover:border-accent hover:bg-accent sm:h-12 sm:w-12 ${
        side === 'left' ? 'left-3 sm:left-4' : 'right-3 sm:right-4'
      }`}
    >
      <Icon size={20} />
    </button>
  )
}

function Spec({
  label,
  value,
  className = '',
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={`rounded-[5px] border border-white/10 bg-white/[0.03] px-4 py-3 ${className}`}>
      <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{label}</dt>
      <dd className="mt-1 text-sm font-semibold">{value}</dd>
    </div>
  )
}
