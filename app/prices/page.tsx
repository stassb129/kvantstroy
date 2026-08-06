import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import PriceList from '@/components/PriceList'
import Documents from '@/components/Documents'

export const metadata: Metadata = {
  title: 'Цены и документы',
  description:
    'Стартовые цены на напольные покрытия, поклейку обоев и стяжку пола. Типовой договор, коммерческое предложение и презентация компании — скачать в PDF.',
}

export default function PricesPage() {
  return (
    <>
      <PageHero
        label="Цены и документы"
        title={
          <>
            Прозрачные условия <span className="text-accent">без сюрпризов</span>
          </>
        }
        description="Смета фиксируется в договоре и не меняется в процессе работ. Все документы доступны для скачивания до подписания."
      />
      <PriceList />
      <Documents />
    </>
  )
}
