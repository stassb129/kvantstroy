'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Menu, Phone, X } from 'lucide-react'
import { navLinks, site } from '@/lib/site'
import { EASE } from '@/lib/motion'
import { useLeadModal } from '@/components/LeadModal'
import Logo from '@/components/Logo'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { openLeadModal } = useLeadModal()

  // Hash-only links (e.g. /#contacts) never count as the active page.
  const isActive = (href: string) => !href.includes('#') && pathname.startsWith(href)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-ink/70 backdrop-blur-md shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)]'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between gap-6 lg:h-24">
        <Logo />

        <nav className="hidden items-center gap-7 xl:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`group relative text-sm font-medium transition-colors ${
                  active ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300 ${
                    active ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-5">
          <div className="hidden flex-col items-end leading-none lg:flex">
            <a
              href={site.phoneHref}
              className="text-base font-bold tracking-tight transition-colors hover:text-accent"
            >
              {site.phone}
            </a>
            <span className="mt-1.5 text-[11px] font-medium text-white/45">{site.schedule}</span>
          </div>

          <button
            type="button"
            onClick={() => openLeadModal('Шапка сайта')}
            className="btn-accent hidden !px-6 !py-3 !text-xs sm:inline-flex"
          >
            Оставить заявку
          </button>

          <button
            type="button"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition-colors hover:border-accent hover:text-accent xl:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden border-t border-white/10 bg-ink/95 backdrop-blur-xl xl:hidden"
          >
            <div className="container-x flex flex-col gap-1 py-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: EASE }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={`block border-b border-white/5 py-3.5 text-lg font-semibold transition-colors hover:text-accent ${
                      isActive(link.href) ? 'text-accent' : 'text-white/80'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="mt-5 flex flex-col gap-3">
                <a
                  href={site.phoneHref}
                  className="flex items-center gap-3 text-xl font-bold tracking-tight"
                >
                  <Phone size={18} className="text-accent" />
                  {site.phone}
                </a>
                <span className="flex items-center gap-3 text-sm text-white/50">
                  <Clock size={16} className="text-accent" />
                  {site.schedule}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    openLeadModal('Мобильное меню')
                  }}
                  className="btn-accent mt-2 w-full"
                >
                  Оставить заявку
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
