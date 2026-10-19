'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Cuboid, Info, LayoutGrid, PaintRoller } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'
import { formatPriceItem, priceGroups } from '@/lib/prices'
import type { PriceGroup } from '@/lib/prices'
import { extraWorksNote } from '@/lib/site'

const groupIcons: Record<PriceGroup['id'], LucideIcon> = {
  wallpaper: PaintRoller,
  floors: LayoutGrid,
  screed: Cuboid,
}

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
            Указана стоимость работ без учёта материалов. Точную цену инженер зафиксирует в договоре после
            бесплатного замера.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="section-gap overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_24px_60px_-40px_rgba(0,0,0,0.5)]"
        >
          <div className="hidden grid-cols-[minmax(0,1fr)_auto] items-center gap-8 border-b border-ink/10 bg-ink/[0.03] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40 sm:grid">
            <span>Вид работ</span>
            <span className="text-right">Стоимость</span>
          </div>

          {priceGroups.map((group) => {
            const Icon = groupIcons[group.id]
            return (
              <motion.div key={group.id} variants={fadeInUp} className="border-b border-ink/10 last:border-b-0">
                <div className="group flex items-center justify-between gap-4 bg-ink/[0.02] px-6 py-5 sm:px-8">
                  <span className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                      <Icon size={22} />
                    </span>
                    <span className="text-lg font-extrabold uppercase tracking-tight sm:text-xl">
                      {group.title}
                    </span>
                  </span>
                  <Link
                    href={group.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink/50 transition-colors hover:text-accent"
                  >
                    Детали
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>

                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="grid grid-cols-1 items-center gap-2 border-t border-ink/[0.07] px-6 py-4 transition-colors duration-300 hover:bg-accent/[0.04] sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8 sm:px-8 sm:pl-24"
                  >
                    <span>
                      <span className="block text-sm font-bold sm:text-base">{item.name}</span>
                      {item.note && (
                        <span className="mt-0.5 block text-xs font-light text-ink/50">{item.note}</span>
                      )}
                    </span>
                    <span className="flex items-baseline gap-1.5 whitespace-nowrap sm:justify-end">
                      <span className="text-xl font-black tracking-tight text-accent sm:text-2xl">
                        {formatPriceItem(item)}
                      </span>
                      <span className="text-sm font-semibold text-ink/50">{item.unit}</span>
                    </span>
                  </div>
                ))}
              </motion.div>
            )
          })}
        </motion.div>

        <motion.p
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-6 flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/[0.08] px-6 py-4 text-sm font-semibold text-ink sm:px-7"
        >
          <Info size={18} className="shrink-0 text-accent" />
          {`${extraWorksNote}!`}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-6 flex flex-col items-start justify-between gap-5 rounded-2xl border border-ink/10 bg-ink px-6 py-5 text-white sm:flex-row sm:items-center sm:px-7 sm:py-6"
        >
          <p className="max-w-xl text-sm font-light leading-relaxed text-white/60">
            Нужен расчёт под конкретную площадь? Калькулятор на главной покажет стоимость работ для вашего
            помещения.
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
