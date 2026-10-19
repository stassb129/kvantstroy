'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink, Quote, Star } from 'lucide-react'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'
import { profiles } from '@/lib/site'

type Review = {
  name: string
  date: string
  object: string
  rating: number
  text: string
}

const reviews: Review[] = [
  {
    name: 'Заказчик из д. Язово',
    date: '26 мая 2026',
    object: 'Обои в лестничном холле, 130 м²',
    rating: 5,
    text: 'Александр — отличный специалист. Пунктуальный, вежливый. К своей работе относится серьёзно. Работа выполнена с отличным качеством и в установленный срок. Взялся за работу, на которую никто не откликался: клеить надо было на высоте более 4 метров с лесов и не испортить лестницу и ограждение. Всё получилось. Обязательно обращусь повторно.',
  },
  {
    name: 'Алексей Ковалёв',
    date: '14 марта 2025',
    object: 'ЖК «Прайм Парк», 184 м²',
    rating: 5,
    text: 'Всё сделали быстро и качественно. Стяжку залили за два дня, перепад по уровню проверяли при мне — уложились в 1 мм. Паркет лёг идеально, стыков не видно даже вблизи.',
  },
  {
    name: 'Марина Дорохова',
    date: '2 февраля 2025',
    object: 'Апартаменты на Пресне, 96 м²',
    rating: 5,
    text: 'Смету зафиксировали в договоре и ни разу не попросили доплату. Каждый этап присылали фотоотчёт, поэтому я спокойно уехала в командировку и вернулась к готовому ремонту.',
  },
  {
    name: 'Игорь Севастьянов',
    date: '19 ноября 2024',
    object: 'Офис Kvant Group, 410 м²',
    rating: 5,
    text: 'Работали ночами, чтобы не мешать сотрудникам. Наливной пол по 410 м² сдали на неделю раньше срока. Технадзор приезжал на каждую приёмку — это подкупает.',
  },
  {
    name: 'Екатерина Лисовская',
    date: '5 сентября 2024',
    object: 'Дом в Барвихе, 320 м²',
    rating: 5,
    text: 'Массив дуба с тонировкой под заказ — цвет подобрали с третьей выкраски, никто не спорил и не торопил. Через год ни одной щели, хотя дом с сезонной влажностью.',
  },
]

export default function Reviews() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', containScroll: 'trimSnaps' })
  const [selected, setSelected] = useState(0)
  const [snaps, setSnaps] = useState<number[]>([])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelected(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setSnaps(emblaApi.scrollSnapList())
    onSelect()
    emblaApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section id="reviews" className="relative scroll-mt-28 overflow-hidden border-t border-white/10 section-y">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#151515_0%,#1F1B18_50%,#141414_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(232,106,0,0.16),transparent_60%)]" />
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
              Отзывы
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="mt-4 text-balance text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl"
            >
              Реальные отзывы <span className="text-accent">заказчиков</span>
            </motion.h2>
          </div>

          <motion.div variants={fadeInUp} className="flex gap-3">
            <CarouselButton onClick={scrollPrev} label="Предыдущий отзыв">
              <ChevronLeft size={20} />
            </CarouselButton>
            <CarouselButton onClick={scrollNext} label="Следующий отзыв">
              <ChevronRight size={20} />
            </CarouselButton>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="section-gap"
        >
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex touch-pan-y card-gap">
              {reviews.map((review) => (
                <article
                  key={review.name}
                  className="group relative min-w-0 flex-[0_0_100%] rounded-3xl border border-white/10 bg-white/[0.04] card-pad backdrop-blur-sm transition-colors duration-300 hover:border-accent/45 sm:flex-[0_0_calc(50%-10px)] lg:flex-[0_0_calc(33.333%-14px)]"
                >
                  <Quote
                    size={40}
                    className="absolute right-6 top-6 text-white/[0.06] transition-colors duration-300 group-hover:text-accent/20"
                  />

                  <div className="flex gap-1" aria-label={`Оценка ${review.rating} из 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'fill-accent text-accent' : 'text-white/20'}
                      />
                    ))}
                  </div>

                  <p className="relative mt-5 text-sm font-light leading-relaxed text-white/70">
                    «{review.text}»
                  </p>

                  <footer className="mt-6 border-t border-white/10 pt-5">
                    <span className="block text-sm font-bold uppercase tracking-wide">{review.name}</span>
                    <span className="mt-1.5 block text-xs font-light text-white/40">{review.object}</span>
                    <span className="mt-1 block text-xs font-light text-white/30">{review.date}</span>
                  </footer>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2.5">
            {snaps.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Перейти к отзыву ${i + 1}`}
                aria-current={i === selected}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selected ? 'w-10 bg-accent' : 'w-4 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <span className="text-sm font-light text-white/50">Все отзывы на площадках:</span>
            <div className="flex flex-wrap justify-center gap-3">
              {profiles.map((profile) => (
                <a
                  key={profile.href}
                  href={profile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost !px-5 !py-3 !text-xs"
                >
                  {profile.label}
                  <ExternalLink size={14} className="text-accent" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function CarouselButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:shadow-accent"
    >
      {children}
    </button>
  )
}
