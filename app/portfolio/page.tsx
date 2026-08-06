import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import HorizontalPortfolio from '@/components/HorizontalPortfolio'
import Reviews from '@/components/Reviews'

export const metadata: Metadata = {
  title: 'Наши работы и отзывы',
  description:
    'Портфолио сданных объектов КВАНТ-СТРОЙ: стяжка, напольные покрытия и обои в квартирах, офисах и загородных домах. Реальные отзывы заказчиков.',
}

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        label="Портфолио"
        title={
          <>
            Наши <span className="text-accent">работы</span>
          </>
        }
        description="Более 500 сданных объектов: от студий до коммерческих помещений площадью 400 м². Листайте кейсы — каждый этап фиксируем фотоотчётом."
      />
      <HorizontalPortfolio />
      <Reviews />
    </>
  )
}
