'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Camera } from 'lucide-react'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'

type Project = {
  title: string
  category: string
  meta: string
  /** Tailwind gradient used until real photography is wired in. */
  tone: string
}

const projects: Project[] = [
  {
    title: 'ЖК «Прайм Парк»',
    category: 'Стяжка + полы',
    meta: '184 м² · 2025',
    tone: 'from-[#2E2E2E] via-[#4A4A4A] to-[#242424]',
  },
  {
    title: 'Апартаменты на Пресне',
    category: 'Инженерная доска',
    meta: '96 м² · 2025',
    tone: 'from-[#3A3430] via-[#5A4A3C] to-[#2A2522]',
  },
  {
    title: 'Офис Kvant Group',
    category: 'Наливной пол',
    meta: '410 м² · 2024',
    tone: 'from-[#282828] via-[#404040] to-[#1F1F1F]',
  },
  {
    title: 'Дом в Барвихе',
    category: 'Массив дуба',
    meta: '320 м² · 2024',
    tone: 'from-[#332B24] via-[#57453A] to-[#241E19]',
  },
  {
    title: 'ЖК «Символ»',
    category: 'Обои под покраску',
    meta: '78 м² · 2024',
    tone: 'from-[#2C2C2C] via-[#464646] to-[#222222]',
  },
  {
    title: 'Ресторан «Веранда»',
    category: 'Тёплый пол под ключ',
    meta: '215 м² · 2023',
    tone: 'from-[#352A20] via-[#5C4630] to-[#26201A]',
  },
]

export default function PortfolioGallery() {
  return (
    <section id="works" className="scroll-mt-28 section-y pt-0">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="container-x grid card-gap sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <motion.figure
            key={project.title}
            variants={fadeInUp}
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-3xl border-2 border-white/10 transition-colors duration-300 hover:border-accent"
          >
            {/* Placeholder — swap for <Image /> once photography is ready. */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${project.tone} transition-transform duration-700 ease-out group-hover:scale-105`}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(115deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 24px)',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/30">
                <Camera size={30} />
                <span className="text-xs font-bold uppercase tracking-[0.28em]">Фото объекта</span>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
            <div className="absolute inset-0 bg-accent/15 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                  {project.category}
                </span>
                <span className="mt-2 block text-lg font-extrabold uppercase leading-tight tracking-tight">
                  {project.title}
                </span>
                <span className="mt-1.5 block text-xs font-light text-white/50">{project.meta}</span>
              </span>
              <span className="flex h-11 w-11 shrink-0 translate-y-2 items-center justify-center rounded-full bg-accent text-white opacity-0 shadow-accent transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight size={19} />
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  )
}
