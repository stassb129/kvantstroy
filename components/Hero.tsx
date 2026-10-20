'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarCheck, ShieldCheck, Sparkles } from 'lucide-react'
import { EASE, fadeInUp, slideInRight, staggerContainer } from '@/lib/motion'

const highlights = [
  { icon: ShieldCheck, text: 'Гарантия до 5 лет' },
  { icon: Sparkles, text: 'Лазерный контроль уровня' },
  { icon: CalendarCheck, text: 'Сдача в срок по договору' },
]

export default function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-ink section-y pt-14 lg:pt-20">
      <MeshBackground />

      <div className="container-x relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8 xl:gap-12">
          {/* Copy */}
          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            animate="visible"
            className="max-w-xl xl:max-w-2xl"
          >
            <motion.span variants={fadeInUp} className="section-label">
              <span className="h-px w-10 bg-accent" />
              Строительная компания полного цикла
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="mt-4 text-balance text-3xl font-bold uppercase leading-[1.08] tracking-tight sm:text-4xl lg:text-[2.75rem] xl:text-5xl"
            >
              Полы и стены
              <br />
              <span className="text-accent">под ключ</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-4 max-w-md text-sm font-light leading-relaxed text-white/60 sm:text-base lg:text-lg"
            >
              Стяжка, напольные покрытия и поклейка обоев — инженерные решения и качество на каждом этапе.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8">
              <a href="#calculator" className="btn-accent group">
                Рассчитать стоимость
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </motion.div>

            <motion.ul
              variants={fadeInUp}
              className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6"
            >
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-sm font-medium text-white/50">
                  <Icon size={15} className="text-accent" />
                  {text}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Floor stack visual from /public */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(232,106,0,0.32),transparent_68%)] blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-[42%] top-[40%] h-[45%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,138,38,0.2),transparent_70%)] blur-2xl"
            />
            <Image
              src="/herro-parket.png"
              alt="Слои пола под ключ: финишное покрытие, демпферный слой, армированная стяжка и основание"
              width={1200}
              height={900}
              priority
              className="relative z-10 h-auto w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function MeshBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-50" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
        className="absolute -left-40 top-10 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(232,106,0,0.18),transparent_65%)] blur-3xl"
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-ink" />
    </div>
  )
}
