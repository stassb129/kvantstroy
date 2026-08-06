import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { LeadModalProvider } from '@/components/LeadModal'
import CustomCursor from '@/components/CustomCursor'
import SmoothScroll from '@/components/SmoothScroll'
import ScrollProgress from '@/components/ScrollProgress'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: {
    default: 'КВАНТ-СТРОЙ — Полы и стены под ключ',
    template: '%s | КВАНТ-СТРОЙ',
  },
  description:
    'Стяжка, напольные покрытия (ламинат, паркет, линолеум) и поклейка обоев под ключ. Инженерные решения и качество на каждом этапе. Гарантия до 5 лет.',
  keywords: [
    'стяжка пола',
    'напольные покрытия',
    'укладка ламината',
    'укладка линолеума',
    'поклейка обоев',
    'ремонт под ключ',
    'КВАНТ-СТРОЙ',
  ],
  openGraph: {
    title: 'КВАНТ-СТРОЙ — Полы и стены под ключ',
    description: 'Стяжка, напольные покрытия и обои — инженерные решения и качество на каждом этапе.',
    locale: 'ru_RU',
    type: 'website',
  },
  icons: {
    icon: [{ url: '/logo.svg', type: 'image/svg+xml' }],
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#1A1A1A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={montserrat.variable}>
      <body className="flex min-h-screen flex-col bg-ink text-white">
        <SmoothScroll />
        <ScrollProgress />
        <CustomCursor />
        <LeadModalProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LeadModalProvider>
      </body>
    </html>
  )
}
