'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/motion'

type Props = {
  label: string
  title: React.ReactNode
  description?: string
}

/** Compact hero reused by every inner page. */
export default function PageHero({ label, title, description }: Props) {
  return (
    <section className="relative isolate overflow-hidden section-y-tight">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-lines opacity-60" />
        <div className="absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(232,106,0,0.32),transparent_65%)] blur-3xl animate-float" />
        <div className="absolute -left-40 top-10 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,138,38,0.14),transparent_65%)] blur-3xl animate-float-slow" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        animate="visible"
        className="container-x"
      >
        <motion.span variants={fadeInUp} className="section-label">
          <span className="h-px w-10 bg-accent" />
          {label}
        </motion.span>

        <motion.h1
          variants={fadeInUp}
          className="mt-4 max-w-4xl text-balance text-4xl font-black uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            variants={fadeInUp}
            className="mt-4 max-w-2xl text-base font-light leading-relaxed text-white/55 lg:text-lg"
          >
            {description}
          </motion.p>
        )}
      </motion.div>
    </section>
  )
}
