'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import { useLeadModal } from '@/components/LeadModal'
import { EASE, fadeInUp, slideInLeft, slideInRight, staggerContainer, viewportOnce } from '@/lib/motion'
import { extraWorksNote } from '@/lib/site'

type Spec = { label: string; value: string }

type Service = {
  id: string
  number: string
  title: string
  eyebrow: string
  description: string
  price: string
  unit: string
  image: string
  imageAlt: string
  bullets: string[]
  specs?: Spec[]
}

const services: Service[] = [
  {
    id: 'floors',
    number: '01',
    title: 'ПОЛЫ',
    eyebrow: 'Напольные покрытия',
    description:
      'Укладываем почти все виды напольных покрытий: ламинат, кварцвинил, керамогранит, линолеум и мармолеум, инженерную доску, паркет и массив. Готовим основание, контролируем влажность и сдаём пол без скрипов и перепадов.',
    price: 'от 400',
    unit: '₽/м²',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80',
    imageAlt: 'Напольное покрытие в современном интерьере',
    bullets: [
      'Ламинат, кварцвинил, линолеум',
      'Керамогранит, паркет, массив',
      'Подложка, порожки, плинтус в смете',
    ],
    specs: [
      {
        label: 'Виды покрытий',
        value: 'ламинат, кварцвинил, керамогранит, линолеум, мармолеум, инженерная доска, паркет, массив',
      },
      { label: 'Класс износостойкости (ламинат)', value: '31–34' },
      { label: 'Влажность основания', value: 'не более 2,0 % CM' },
      { label: 'Финиш для дерева', value: 'масло-воск Osmo, лак Bona' },
      { label: 'Гарантия на монтаж', value: 'до 5 лет' },
    ],
  },
  {
    id: 'wallpaper',
    number: '02',
    title: 'ОБОИ',
    eyebrow: 'Стены под ключ',
    description:
      'Идеальные стены для интерьера: подготовка плоскости, грунт и аккуратная стыковка полотен — от флизелина до текстиля и стеклохолста.',
    price: 'от 600',
    unit: '₽/м²',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80',
    imageAlt: 'Фактурные стены в современном интерьере',
    bullets: ['Подготовка под покраску', 'Бесшовная стыковка', 'Дизайнерские фактуры', 'Фрески и фотообои'],
    specs: [
      { label: 'Подготовка стен', value: 'шпаклёвка Q3–Q4, грунт в 2 слоя' },
      { label: 'Типы полотна', value: 'флизелин, винил, текстиль, стеклохолст' },
      { label: 'Допуск по стыкам', value: 'до 0,3 мм, без нахлёста' },
      { label: 'Гарантия на монтаж', value: '3 года' },
    ],
  },
  {
    id: 'screed',
    number: '03',
    title: 'СТЯЖКА',
    eyebrow: 'Инженерная основа',
    description:
      'Основа идеального пола: полусухая и наливная стяжка с лазерным контролем. По желанию — тёплый пол под ключ в одной смете.',
    price: 'от 700',
    unit: '₽/м²',
    image:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80',
    imageAlt: 'Устройство стяжки пола',
    bullets: ['Полусухая и наливная', 'Лазерный контроль уровня', 'Тёплый пол под ключ'],
    specs: [
      { label: 'Прочность на сжатие', value: 'М150–М300' },
      { label: 'Толщина слоя', value: 'от 40 до 120 мм' },
      { label: 'Перепад по плоскости', value: 'не более 2 мм на 2 м' },
      { label: 'Готовность к укладке', value: '12 дней (полусухая технология)' },
      { label: 'Армирование', value: 'фиброволокно, сетка 100×100' },
      { label: 'Гарантия на работы', value: '5 лет' },
    ],
  },
]

export default function ServicesDetail() {
  return (
    <section id="technologies" className="scroll-mt-28 section-y pt-0">
      <div className="container-x flex flex-col gap-8 lg:gap-10">
        {services.map((service, index) => (
          <ServiceRow key={service.id} service={service} index={index} />
        ))}
      </div>
    </section>
  )
}

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const { openLeadModal } = useLeadModal()
  const {
    id,
    number,
    title,
    eyebrow,
    description,
    price,
    unit,
    image,
    imageAlt,
    bullets,
    specs,
  } = service
  const [open, setOpen] = useState(false)
  const flipped = index % 2 === 1

  return (
    <motion.article
      id={id}
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="group relative scroll-mt-28 overflow-hidden rounded-[28px] border border-white/10 bg-ink-700/50 transition-colors duration-300 hover:border-accent/40"
    >
      <div className="absolute inset-x-0 top-0 h-1 w-0 bg-accent-gradient transition-all duration-700 group-hover:w-full" />

      <div
        className={`relative grid items-stretch lg:grid-cols-2 ${
          flipped ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        <motion.div
          variants={flipped ? slideInRight : slideInLeft}
          className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent"
          />
          <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
            <span className="rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
              {eyebrow}
            </span>
          </div>
          <span className="absolute bottom-3 right-5 select-none text-7xl font-black leading-none text-white/20 sm:text-8xl">
            {number}
          </span>
        </motion.div>

        <motion.div
          variants={flipped ? slideInLeft : slideInRight}
          className="relative flex flex-col justify-center card-pad lg:p-10"
        >
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-accent">
            {number} · {eyebrow}
          </span>
          <h2 className="mt-3 text-4xl font-black uppercase tracking-tight lg:text-5xl xl:text-6xl">
            {title}
          </h2>
          <p className="mt-4 text-base font-light leading-relaxed text-white/50 lg:text-lg">
            {description}
          </p>

          <ul className="mt-6 space-y-3">
            {bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 transition-colors duration-300 hover:border-accent/40 hover:bg-white/[0.06]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Check size={15} />
                </span>
                <span className="text-sm font-medium text-white/80">{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                Работы без материалов
              </span>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-black tracking-tight text-accent">{price}</span>
                <span className="text-sm font-semibold text-white/50">{unit}</span>
              </p>
              <p className="mt-1.5 text-xs font-light text-white/45">{extraWorksNote}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/#calculator" className="btn-ghost px-5 py-3 text-xs">
                Калькулятор
              </Link>
              <button
                type="button"
                onClick={() => openLeadModal(`Услуги · ${title}`)}
                className="btn-accent group/link px-5 py-3 text-xs"
              >
                Заказать замер
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover/link:translate-x-1"
                />
              </button>
            </div>
          </div>

          {specs && (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/25">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={`${id}-specs`}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-300 hover:bg-white/[0.04]"
              >
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">
                  Технические данные производителей
                </span>
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent"
                >
                  <ChevronDown size={15} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={`${id}-specs`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <dl className="divide-y divide-white/5 border-t border-white/10 px-5">
                      {specs.map((spec) => (
                        <div
                          key={spec.label}
                          className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                        >
                          <dt className="text-xs font-medium text-white/40">{spec.label}</dt>
                          <dd className="text-sm font-semibold text-white/85 sm:text-right">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>

      <motion.span
        variants={fadeInUp}
        aria-hidden
        className={`pointer-events-none absolute bottom-0 select-none text-[9rem] font-black leading-none tracking-tighter text-white/[0.02] lg:text-[13rem] ${
          flipped ? 'left-6' : 'right-6'
        }`}
      >
        {number}
      </motion.span>
    </motion.article>
  )
}
