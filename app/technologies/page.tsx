import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import TechnologiesContent from '@/components/TechnologiesContent'

export const metadata: Metadata = {
  title: 'Технологии и материалы',
  description:
    'Гид по напольным покрытиям и видам обоев: плюсы, минусы и рекомендации КВАНТ-СТРОЙ по выбору материалов для квартиры и дома.',
}

export default function TechnologiesPage() {
  return (
    <>
      <PageHero
        label="Технологии"
        title={
          <>
            Материалы, в которых <span className="text-accent">мы уверены</span>
          </>
        }
        description="Два подробных обзора — напольные покрытия и обои. Переключайте вкладки, сравнивайте плюсы и минусы, а за точным расчётом под ваш объект оставьте заявку."
      />
      <TechnologiesContent />
    </>
  )
}
