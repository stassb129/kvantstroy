'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Calculator as CalcIcon, ChevronDown, Ruler, Wrench } from 'lucide-react'
import { fadeInUp, scaleIn, staggerContainer, viewportOnce } from '@/lib/motion'
import { useLeadModal } from '@/components/LeadModal'

/** Rate per m²: [работы, работы + базовые материалы] */
const WORK_TYPES = [
  { id: 'screed', label: 'Устройство стяжки пола', workRate: 1300, fullRate: 1500 },
  { id: 'floors', label: 'Укладка напольных покрытий', workRate: 1700, fullRate: 2400 },
  { id: 'wallpaper', label: 'Поклейка обоев', workRate: 750, fullRate: 1050 },
] as const

const AREA_PRESETS = [10, 50, 100, 150, 200] as const

const MIN_AREA = 5
const MAX_AREA = 300
const DEFAULT_AREA = 75

const formatPrice = (value: number) => new Intl.NumberFormat('ru-RU').format(Math.round(value))

export default function Calculator() {
  const { openLeadModal } = useLeadModal()
  const [area, setArea] = useState<number>(DEFAULT_AREA)
  const [workTypeId, setWorkTypeId] = useState<string>(WORK_TYPES[0].id)
  // Seeded with the defaults so the server render already shows real figures.
  const [prices, setPrices] = useState(() => ({
    work: DEFAULT_AREA * WORK_TYPES[0].workRate,
    full: DEFAULT_AREA * WORK_TYPES[0].fullRate,
  }))

  const workType = useMemo(
    () => WORK_TYPES.find((t) => t.id === workTypeId) ?? WORK_TYPES[0],
    [workTypeId],
  )

  useEffect(() => {
    setPrices({
      work: area * workType.workRate,
      full: area * workType.fullRate,
    })
  }, [area, workType])

  const sliderProgress = ((area - MIN_AREA) / (MAX_AREA - MIN_AREA)) * 100

  return (
    <section id="calculator" className="relative overflow-hidden section-y">
      <Backdrop />

      <div className="container-x relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.span variants={fadeInUp} className="section-label">
              <span className="h-px w-10 bg-accent" />
              Прозрачная смета
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="mt-4 text-balance text-4xl font-black uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Узнайте стоимость <span className="text-accent">за 30 секунд</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-4 max-w-md text-base font-light leading-relaxed text-white/50"
            >
              Предварительный расчёт учитывает площадь и тип работ. Точную смету инженер подготовит после
              бесплатного замера — цена в договоре не меняется.
            </motion.p>

            <motion.ul variants={fadeInUp} className="section-gap space-y-4">
              {[
                { icon: Ruler, title: 'Бесплатный замер', text: 'Выезд инженера в день обращения' },
                { icon: Wrench, title: 'Фиксированная смета', text: 'Без доплат в процессе работ' },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                    <Icon size={19} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold uppercase tracking-wide">{title}</span>
                    <span className="mt-1 block text-sm font-light text-white/45">{text}</span>
                  </span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="glass-card relative overflow-hidden card-pad sm:p-10"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/25 blur-3xl"
            />

            <div className="relative flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-gradient shadow-accent">
                <CalcIcon size={22} />
              </span>
              <h3 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
                Калькулятор стоимости
              </h3>
            </div>

            {/* Площадь */}
            <div className="relative mt-8">
              <div className="flex items-end justify-between gap-4">
                <label htmlFor="area-slider" className="text-sm font-semibold text-white/60">
                  Площадь помещения
                </label>
                <span className="flex items-baseline gap-1.5">
                  <motion.span
                    key={area}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-3xl font-black leading-none text-accent"
                  >
                    {area}
                  </motion.span>
                  <span className="text-sm font-semibold text-white/50">м²</span>
                </span>
              </div>

              <div className="relative mt-5">
                <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/10" />
                <div
                  className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent-gradient"
                  style={{ width: `${sliderProgress}%` }}
                />
                <input
                  id="area-slider"
                  type="range"
                  min={MIN_AREA}
                  max={MAX_AREA}
                  step={1}
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  aria-label="Площадь помещения в квадратных метрах"
                  className="relative w-full"
                />
              </div>

              <div className="mt-5 grid grid-cols-5 gap-2">
                {AREA_PRESETS.map((preset) => {
                  const active = area === preset
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setArea(preset)}
                      aria-pressed={active}
                      className={`rounded-xl border px-1 py-2.5 text-xs font-bold transition-all duration-300 sm:text-sm ${
                        active
                          ? 'border-accent bg-accent text-white shadow-accent'
                          : 'border-white/[0.12] bg-white/5 text-white/60 hover:border-accent/50 hover:text-white'
                      }`}
                    >
                      {preset}
                      <span className="ml-0.5 text-[10px] font-medium opacity-70">м²</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Тип работ */}
            <div className="relative mt-6">
              <label htmlFor="work-type" className="text-sm font-semibold text-white/60">
                Тип работ
              </label>
              <div className="relative mt-3">
                <select
                  id="work-type"
                  value={workTypeId}
                  onChange={(e) => setWorkTypeId(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-2xl border border-white/[0.12] bg-ink-700/80 px-5 py-4 pr-12 text-sm font-semibold text-white outline-none transition-colors duration-300 hover:border-accent/50 focus:border-accent"
                >
                  {WORK_TYPES.map((type) => (
                    <option key={type.id} value={type.id} className="bg-ink-800 text-white">
                      {type.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-accent"
                />
              </div>
            </div>

            {/* Итог */}
            <div className="relative mt-6 rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-6">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">
                Итоговая стоимость
              </span>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <PriceBlock label="Только работы" value={prices.work} />
                <PriceBlock label="Работы + материалы" value={prices.full} highlighted />
              </div>

              <p className="mt-4 border-t border-white/10 pt-4 text-xs font-light text-white/40">
                {formatPrice(workType.workRate)} ₽/м² за работы · {formatPrice(workType.fullRate)} ₽/м² с
                базовыми материалами
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                openLeadModal(`Калькулятор · ${workType.label} · ${area} м²`)
              }
              className="btn-accent group relative mt-6 w-full !py-4"
            >
              Получить расчёт
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="relative mt-3.5 text-center text-xs font-light text-white/40">
              Расчет бесплатный и ни к чему не обязывает
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function PriceBlock({
  label,
  value,
  highlighted = false,
}: {
  label: string
  value: number
  highlighted?: boolean
}) {
  const display = useAnimatedNumber(value)

  return (
    <div
      className={`rounded-xl px-4 py-4 transition-colors duration-300 ${
        highlighted ? 'bg-accent/[0.12] ring-1 ring-inset ring-accent/35' : 'bg-white/[0.04]'
      }`}
    >
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/45">{label}</span>
      <span
        className={`mt-2 block whitespace-nowrap text-2xl font-black tracking-tight sm:text-[1.75rem] ${
          highlighted ? 'text-accent' : 'text-white'
        }`}
      >
        {formatPrice(display)} ₽
      </span>
    </div>
  )
}

/** Eases the displayed price toward the target so recalculations feel fluid. */
function useAnimatedNumber(target: number, duration = 450) {
  const [display, setDisplay] = useState(target)
  const fromRef = useRef(target)
  const frameRef = useRef<number>()

  useEffect(() => {
    const from = fromRef.current
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = from + (target - from) * eased
      setDisplay(current)
      fromRef.current = current
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
      else fromRef.current = target
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration])

  return display
}

function Backdrop() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#1A1A1A_0%,#141414_45%,#1A1A1A_100%)]" />
      <div className="absolute inset-0 grid-lines opacity-60" />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        className="absolute -left-32 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(232,106,0,0.28),transparent_65%)] blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.15, ease: 'easeOut' }}
        className="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(140,140,190,0.16),transparent_65%)] blur-3xl"
      />
    </div>
  )
}
