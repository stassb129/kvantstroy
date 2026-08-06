import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Calculator from '@/components/Calculator'
import Stats from '@/components/Stats'
import Documents from '@/components/Documents'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Calculator />
      <Stats />
      <Documents variant="cta" />
    </>
  )
}
