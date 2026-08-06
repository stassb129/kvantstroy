import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import ServicesDetail from '@/components/ServicesDetail'
import Documents from '@/components/Documents'

export const metadata: Metadata = {
  title: 'Услуги и материалы',
  description:
    'Три направления полного цикла: напольные покрытия, поклейка обоев и устройство стяжки пола. Технические данные материалов, состав работ и гарантия до 5 лет.',
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="Наши услуги"
        title={
          <>
            Три направления <span className="text-accent">полного цикла</span>
          </>
        }
        description="Работаем по договору с фиксированной сметой: стяжка, напольные покрытия (ламинат, линолеум, паркет) и поклейка обоев — от подготовки до сдачи объекта."
      />
      <ServicesDetail />
      <Documents variant="cta" />
    </>
  )
}
