'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react'
import { navLinks, profiles, servicesNav, site } from '@/lib/site'
import { fadeInUp, staggerContainer, viewportOnce } from '@/lib/motion'
import { useLeadModal } from '@/components/LeadModal'
import Logo from '@/components/Logo'

export default function Footer() {
  const year = new Date().getFullYear()
  const { openLeadModal } = useLeadModal()

  return (
    <footer id="contacts" className="relative overflow-hidden bg-ink-900 section-y pb-0 pt-20 lg:pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_50%_0%,rgba(232,106,0,0.14),transparent_65%)]"
      />

      <div className="container-x relative">
        {/* CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="glass-card flex flex-col items-start justify-between gap-6 card-pad sm:p-10 lg:flex-row lg:items-center"
        >
          <div>
            <h2 className="text-balance text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
              Готовы обсудить <span className="text-accent">ваш объект?</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm font-light leading-relaxed text-white/50">
              Оставьте заявку — инженер перезвонит в течение 15 минут, согласует удобное время замера и
              подготовит смету.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a href={site.phoneHref} className="btn-ghost whitespace-nowrap">
              <Phone size={17} className="text-accent" />
              {site.phone}
            </a>
            <button
              type="button"
              onClick={() => openLeadModal('Подвал сайта')}
              className="btn-accent whitespace-nowrap"
            >
              Оставить заявку
            </button>
          </div>
        </motion.div>

        {/* Columns */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="section-gap grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:pt-12"
        >
          <motion.div variants={fadeInUp} className="lg:pr-8">
            <Logo />
            <p className="mt-6 text-sm font-light leading-relaxed text-white/45">
              Строительная компания полного цикла. Инженерные решения и безупречное качество на каждом этапе.
            </p>
          </motion.div>

          <motion.nav variants={fadeInUp}>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">Навигация</h3>
            <ul className="mt-6 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-accent"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition-all duration-300 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.div variants={fadeInUp}>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">Услуги</h3>
            <ul className="mt-6 space-y-3">
              {servicesNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">Контакты</h3>
            <ul className="mt-6 space-y-4 text-sm">
              <li>
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-3 text-lg font-bold tracking-tight transition-colors hover:text-accent"
                >
                  <Phone size={17} className="shrink-0 text-accent" />
                  {site.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/50">
                <Clock size={16} className="shrink-0 text-accent" />
                {site.schedule}
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-3 text-white/50 transition-colors hover:text-accent"
                >
                  <Mail size={16} className="shrink-0 text-accent" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/50">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent" />
                {site.address}
              </li>
              {profiles.map((profile) => (
                <li key={profile.href}>
                  <a
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/50 transition-colors hover:text-accent"
                  >
                    <ExternalLink size={16} className="shrink-0 text-accent" />
                    Мы на {profile.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-xs text-white/35 sm:flex-row lg:mt-12">
          <span>
            © {year} {site.name}. Все права защищены.
          </span>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-accent">
              Политика конфиденциальности
            </a>
            <a href="#" className="transition-colors hover:text-accent">
              Договор оферты
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
