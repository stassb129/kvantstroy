'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, Minus } from 'lucide-react'
import { techArticles, type TechArticleId } from '@/lib/technologies'
import { EASE, fadeInUp, staggerContainer } from '@/lib/motion'
import { useLeadModal } from '@/components/LeadModal'

type Props = {
  initialTab?: TechArticleId
}

export default function TechnologiesContent({ initialTab = 'floors' }: Props) {
  const [active, setActive] = useState<TechArticleId>(initialTab)
  const { openLeadModal } = useLeadModal()
  const article = techArticles.find((a) => a.id === active) ?? techArticles[0]

  // Sync tab with URL hash (#floors / #wallpaper) without a full navigation.
  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace('#', '') as TechArticleId
      if (id === 'floors' || id === 'wallpaper') setActive(id)
    }
    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [])

  const selectTab = (id: TechArticleId) => {
    setActive(id)
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <section className="section-y pt-0">
      <div className="container-x">
        {/* Tabs */}
        <div className="sticky top-20 z-30 -mx-5 mb-10 bg-ink/80 px-5 py-3 backdrop-blur-md sm:mx-0 sm:mb-12 sm:rounded-2xl sm:border sm:border-white/10 sm:px-3 sm:py-3 lg:top-24">
          <div
            role="tablist"
            aria-label="Разделы технологий"
            className="flex gap-2 overflow-x-auto no-scrollbar"
          >
            {techArticles.map((item) => {
              const selected = item.id === active
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => selectTab(item.id)}
                  className={`shrink-0 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                    selected
                      ? 'bg-accent text-white shadow-accent'
                      : 'border border-white/10 bg-white/5 text-white/60 hover:border-accent/40 hover:text-white'
                  }`}
                >
                  {item.tab}
                </button>
              )
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <header className="max-w-3xl">
              <p className="section-label">
                <span className="h-px w-10 bg-accent" />
                {article.subtitle}
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {article.title}
              </h2>
              <p className="mt-4 text-base font-light leading-relaxed text-white/55 lg:text-lg">
                {article.intro}
              </p>
            </header>

            <motion.div
              variants={staggerContainer(0.08, 0.05)}
              initial="hidden"
              animate="visible"
              className="section-gap flex flex-col card-gap"
            >
              {article.materials.map((block, index) => (
                <motion.div
                  key={block.title}
                  variants={fadeInUp}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-ink-700/40 transition-colors duration-300 hover:border-accent/40"
                >
                  <div className="card-pad">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-2xl">
                        <span className="text-xs font-bold tracking-[0.25em] text-accent">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="mt-3 text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
                          {block.title}
                        </h3>
                        <p className="mt-3 text-sm font-light leading-relaxed text-white/55">
                          {block.lead}
                        </p>
                      </div>
                    </div>

                    {/* Photo examples — like overview galleries in material guides */}
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {block.images.map((img) => (
                        <figure
                          key={img.src}
                          className="group/img relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.src}
                            alt={img.alt}
                            loading="lazy"
                            className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                          />
                          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-3 pt-10 text-[11px] font-medium leading-snug text-white/85">
                            {img.caption}
                          </figcaption>
                        </figure>
                      ))}
                    </div>

                    {block.points && (
                      <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
                        {block.points.map((point) => (
                          <li
                            key={point}
                            className="flex gap-2.5 text-sm leading-relaxed text-white/70"
                          >
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}

                    {block.tip && (
                      <p className="mt-5 rounded-2xl border border-accent/25 bg-accent/10 px-4 py-3 text-sm leading-relaxed text-white/80">
                        <span className="font-bold text-accent">Совет. </span>
                        {block.tip}
                      </p>
                    )}

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <ProsCons title="Плюсы" items={block.pros} positive />
                      <ProsCons title="Минусы" items={block.cons} positive={false} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="section-gap flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.03] card-pad sm:flex-row sm:items-center">
              <p className="max-w-2xl text-sm font-light leading-relaxed text-white/55">
                {article.footer}
              </p>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link href="/services" className="btn-ghost whitespace-nowrap">
                  К услугам
                </Link>
                <button
                  type="button"
                  onClick={() => openLeadModal(`Технологии · ${article.tab}`)}
                  className="btn-accent group whitespace-nowrap"
                >
                  Получить консультацию
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  )
}

function ProsCons({
  title,
  items,
  positive,
}: {
  title: string
  items: string[]
  positive: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
      <span
        className={`text-xs font-bold uppercase tracking-[0.2em] ${
          positive ? 'text-accent' : 'text-white/40'
        }`}
      >
        {title}
      </span>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-white/70">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                positive ? 'bg-accent/15 text-accent' : 'bg-white/5 text-white/35'
              }`}
            >
              {positive ? <Check size={12} strokeWidth={2.5} /> : <Minus size={12} strokeWidth={2.5} />}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
