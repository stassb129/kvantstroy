'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import BeforeAfterSlider from './BeforeAfterSlider'
import { fadeIn, fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'

type Service = {
  number: string
  title: string
  description: string
  href: string
  image: string
  /** -1 left (angled in), 0 center, 1 right (angled in). */
  tilt: -1 | 0 | 1
}

const services: Service[] = [
  {
    number: '01',
    title: 'ПОЛЫ',
    description: 'Ламинат, кварцвинил, керамогранит, линолеум и паркет',
    href: '/services#floors',
    tilt: -1,
    image: '/images/stock/home-floors.jpg',
  },
  {
    number: '02',
    title: 'ОБОИ',
    description: 'Идеальные стены для вашего интерьера',
    href: '/services#wallpaper',
    tilt: 0,
    image: '/images/stock/home-wallpaper.jpg',
  },
  {
    number: '03',
    title: 'СТЯЖКА',
    description: 'Основа идеального пола',
    href: '/services#screed',
    tilt: 1,
    image: '/images/stock/home-screed.jpg',
  },
]

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-ink section-y">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-64 w-[70%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(232,106,0,0.16),transparent_70%)] blur-2xl" />
      </div>

      <div className="container-x">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <motion.span variants={fadeInUp} className="section-label">
              <span className="h-px w-10 bg-accent" />
              Наши услуги
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="mt-4 text-balance text-4xl font-black uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Три направления <span className="text-accent">полного цикла</span>
            </motion.h2>
          </div>
          <motion.div variants={fadeInUp}>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent"
            >
              Все услуги подробно
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.12, 0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="section-gap flex flex-col items-center gap-5 md:flex-row md:items-center md:justify-center md:gap-0 lg:px-4"
        >
          {services.map((service) => (
            <ServiceCard key={service.number} service={service} />
          ))}
        </motion.div>

        <motion.div
          id="works"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="section-gap grid scroll-mt-28 card-gap lg:grid-cols-[1fr_auto]"
        >
          <div className="h-[340px] sm:h-[420px] lg:h-[460px]">
            <BeforeAfterSlider
              initial={46}
              beforeSrc="/portfolio/case-2/02.jpg"
              afterSrc="/portfolio/case-2/01.jpg"
            />
          </div>

          <div className="glass-card flex flex-col justify-between gap-6 card-pad lg:max-w-xs">
            <div>
              <span className="section-label">
                <span className="h-px w-8 bg-accent" />
                До / После
              </span>
              <h3 className="mt-4 text-2xl font-extrabold uppercase leading-tight tracking-tight">
                Результат, который видно
              </h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-white/50">
                Двигайте ползунок, чтобы сравнить состояние объекта до начала работ и после сдачи. Каждый
                этап фиксируем фотоотчётом в личном кабинете.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent"
            >
              Смотреть портфолио
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ServiceCard({ service }: { service: Service }) {
  const { number, title, description, href, image, tilt } = service
  const featured = tilt === 0

  const tiltClass =
    tilt === -1
      ? 'md:[transform:perspective(1000px)_rotateY(22deg)_translateX(2.5rem)_translateY(1.75rem)_scale(0.9)]'
      : tilt === 1
        ? 'md:[transform:perspective(1000px)_rotateY(-22deg)_translateX(-2.5rem)_translateY(1.75rem)_scale(0.9)]'
        : 'md:[transform:perspective(1000px)_rotateY(0deg)_translateY(-0.5rem)_scale(1.05)]'

  const hoverClass = featured
    ? 'md:hover:[transform:perspective(1000px)_rotateY(0deg)_translateY(-1.25rem)_scale(1.07)]'
    : tilt === -1
      ? 'md:hover:[transform:perspective(1000px)_rotateY(0deg)_translateX(1rem)_translateY(0)_scale(1.02)]'
      : 'md:hover:[transform:perspective(1000px)_rotateY(0deg)_translateX(-1rem)_translateY(0)_scale(1.02)]'

  return (
    <motion.div
      variants={fadeIn}
      className={`w-full max-w-[340px] shrink-0 md:w-[280px] lg:w-[320px] xl:w-[340px] ${featured ? 'md:z-[2]' : 'md:z-[1]'}`}
    >
      <Link
        href={href}
        className={`group relative block overflow-hidden rounded-[28px] shadow-[0_28px_50px_-24px_rgba(0,0,0,0.85)] transition-transform duration-500 ease-out will-change-transform hover:z-[5] ${tiltClass} ${hoverClass} ${
          featured
            ? 'h-[520px] md:h-[560px] lg:h-[600px]'
            : 'h-[520px] md:h-[460px] lg:h-[500px]'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.2)_38%,rgba(0,0,0,0.35)_62%,rgba(0,0,0,0.75)_100%)]"
        />

        <div className="relative z-10 flex h-full flex-col justify-between card-pad">
          <div>
            <span className="text-[15px] font-semibold tracking-wide text-accent">{number}</span>
            <h3 className="mt-3 text-[2rem] font-extrabold uppercase leading-none tracking-tight text-white sm:text-[2.35rem]">
              {title}
            </h3>
            <p className="mt-3 max-w-[15rem] text-[14px] font-normal leading-snug text-white/90 sm:text-[15px]">
              {description}
            </p>
          </div>

          <div className="flex justify-end">
            <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/70 bg-black/25 text-white backdrop-blur-[2px] transition-colors duration-300 group-hover:border-accent group-hover:bg-accent">
              <ChevronRight size={22} strokeWidth={1.75} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
