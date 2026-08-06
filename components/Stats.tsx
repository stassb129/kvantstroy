'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { CalendarCheck, HardHat, ShieldCheck, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'

type Stat = {
  value: number
  suffix?: string
  prefix?: string
  label: string
  icon: LucideIcon
}

const stats: Stat[] = [
  { value: 10, suffix: '+', label: 'лет опыта работы', icon: TrendingUp },
  { value: 500, suffix: '+', label: 'объектов сданы в срок', icon: CalendarCheck },
  // NBSP keeps the unit attached — a plain space is stripped inside the flex row.
  { value: 5, prefix: 'до ', suffix: '\u00A0лет', label: 'гарантия на все работы', icon: ShieldCheck },
  { value: 24, label: 'собственных бригад и технадзор на каждом объекте', icon: HardHat },
]

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden border-y border-white/10 section-y"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,#151515_0%,#1F1B18_45%,#141414_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,106,0,0.18),transparent_60%)]" />
        <div className="absolute inset-0 grid-lines opacity-50" />
      </div>

      <div className="container-x">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-2xl"
        >
          <motion.span variants={fadeInUp} className="section-label">
            <span className="h-px w-10 bg-accent" />
            Цифры и факты
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="mt-4 text-balance text-4xl font-black uppercase leading-[1.02] tracking-tight sm:text-5xl"
          >
            Опыт, подтверждённый <span className="text-accent">объектами</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="section-gap grid card-gap sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map(({ icon: Icon, ...stat }) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] card-pad backdrop-blur-sm transition-colors duration-300 hover:border-accent/50"
            >
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-[linear-gradient(180deg,transparent,rgba(232,106,0,0.14))] transition-all duration-500 group-hover:h-full" />

              <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-accent transition-all duration-300 group-hover:border-accent/50 group-hover:bg-accent group-hover:text-white">
                <Icon size={22} />
              </span>

              <div className="relative mt-6 flex items-baseline text-4xl font-black tracking-tight lg:text-5xl">
                {stat.prefix && <span className="mr-1.5 text-xl font-bold text-white/50">{stat.prefix}</span>}
                <CountUp to={stat.value} start={inView} />
                {stat.suffix && <span className="text-accent">{stat.suffix}</span>}
              </div>

              <p className="relative mt-3 text-sm font-light leading-relaxed text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function CountUp({ to, start, duration = 1800 }: { to: number; start: boolean; duration?: number }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return

    let frame = 0
    const startedAt = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - Math.pow(1 - progress, 4)
      setValue(Math.round(to * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [start, to, duration])

  return <span>{value}</span>
}
