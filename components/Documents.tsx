'use client'

import { motion } from 'framer-motion'
import { Download, FileText } from 'lucide-react'
import { documents } from '@/lib/site'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'

type Props = {
  /** `cta` adds the surrounding pitch used at the bottom of the home page. */
  variant?: 'plain' | 'cta'
  className?: string
}

export default function Documents({ variant = 'plain', className = '' }: Props) {
  const isCta = variant === 'cta'

  return (
    <section id="documents" className={`relative scroll-mt-28 section-y ${className}`}>
      {isCta && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#1A1A1A_0%,#141414_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(232,106,0,0.14),transparent_60%)]" />
        </div>
      )}

      <div className="container-x">
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="max-w-3xl"
        >
          <motion.span variants={fadeInUp} className="section-label">
            <span className="h-px w-10 bg-accent" />
            Документы
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="mt-4 text-balance text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl"
          >
            {isCta ? (
              <>
                Изучите условия <span className="text-accent">до звонка</span>
              </>
            ) : (
              <>
                Документы для <span className="text-accent">скачивания</span>
              </>
            )}
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-4 text-base font-light leading-relaxed text-white/50"
          >
            Типовой договор, коммерческое предложение и презентация — всё в открытом доступе, без заявки и
            регистрации.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.12, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="section-gap grid card-gap md:grid-cols-3"
        >
          {documents.map((doc) => (
            <motion.a
              key={doc.title}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              href={doc.file}
              download={doc.fileName}
              className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border-2 border-accent/45 bg-ink-700/50 card-pad transition-colors duration-300 hover:border-accent hover:bg-accent/[0.07]"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/40 bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent group-hover:text-white">
                  <FileText size={22} />
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/40">
                  {doc.meta}
                </span>
              </div>

              <div className="relative">
                <h3 className="text-lg font-extrabold uppercase leading-tight tracking-tight">{doc.title}</h3>
                <p className="mt-2.5 text-sm font-light leading-relaxed text-white/50">{doc.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent">
                  <Download size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                  Скачать PDF
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
