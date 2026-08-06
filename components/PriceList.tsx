'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Cuboid, LayoutGrid, PaintRoller } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'

type Price = {
  title: string
  note: string
  price: string
  unit: string
  icon: LucideIcon
  href: string
}

const prices: Price[] = [
  {
    title: 'Напольные покрытия',
    note: 'Ламинат, линолеум, паркет — подложка и плинтус в смете',
    price: 'от 800',
    unit: '₽/м²',
    icon: LayoutGrid,
    href: '/services#floors',
  },
  {
    title: 'Поклейка обоев',
    note: 'Подготовка стен считается отдельно',
    price: 'от 600',
    unit: '₽/м²',
    icon: PaintRoller,
    href: '/services#wallpaper',
  },
  {
    title: 'Стяжка пола',
    note: 'Полусухая, слой до 80 мм',
    price: 'от 700',
    unit: '₽/м²',
    icon: Cuboid,
    href: '/services#screed',
  },
]

/** Light band (#F5F5F5) that breaks up the dark page and makes the numbers pop. */
export default function PriceList() {
  return (
    <section id="prices" className="scroll-mt-28 bg-mist text-ink section-y">
      <div className="container-x">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-accent"
            >
              <span className="h-px w-10 bg-accent" />
              Прайс-лист
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="mt-4 text-balance text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl"
            >
              Стартовые <span className="text-accent">цены</span>
            </motion.h2>
          </div>
          <motion.p variants={fadeInUp} className="max-w-md text-sm font-light leading-relaxed text-ink/60">
            Указана минимальная стоимость работ без учёта материалов. Точную цену инженер зафиксирует в
            договоре после бесплатного замера.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="section-gap overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_24px_60px_-40px_rgba(0,0,0,0.5)]"
        >
          <div className="hidden grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-8 border-b border-ink/10 bg-ink/[0.03] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40 sm:grid">
            <span>Вид работ</span>
            <span className="text-right">Стоимость</span>
            <span className="w-24 text-right">Подробнее</span>
          </div>

          {prices.map(({ icon: Icon, ...price }) => (
            <motion.div
              key={price.title}
              variants={fadeInUp}
              className="group grid grid-cols-1 items-center gap-5 border-b border-ink/[0.07] px-6 py-6 transition-colors duration-300 last:border-b-0 hover:bg-accent/[0.04] sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-8 sm:px-8"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                  <Icon size={22} />
                </span>
                <span>
                  <span className="block text-base font-extrabold uppercase tracking-tight sm:text-lg">
                    {price.title}
                  </span>
                  <span className="mt-1 block text-xs font-light text-ink/50">{price.note}</span>
                </span>
              </div>

              <span className="flex items-baseline gap-1.5 sm:justify-end">
                <span className="text-2xl font-black tracking-tight text-accent sm:text-3xl">
                  {price.price}
                </span>
                <span className="text-sm font-semibold text-ink/50">{price.unit}</span>
              </span>

              <Link
                href={price.href}
                className="inline-flex w-24 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/50 transition-colors hover:text-accent sm:justify-end"
              >
                Детали
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-6 flex flex-col items-start justify-between gap-5 rounded-2xl border border-ink/10 bg-ink px-6 py-5 text-white sm:flex-row sm:items-center sm:px-7 sm:py-6"
        >
          <p className="max-w-xl text-sm font-light leading-relaxed text-white/60">
            Нужен расчёт под конкретную площадь? Калькулятор на главной покажет стоимость работ и вариант
            «под ключ» с материалами.
          </p>
          <Link href="/#calculator" className="btn-accent group shrink-0 !py-3">
            Открыть калькулятор
            <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
