import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import LetterCard from '@/components/home/LetterCard'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import SectionDivider from '@/components/shared/SectionDivider'

export default function HomePage () {
  return (
    <>
    <div>
      <Hero/>
      <SectionDivider/>
      <LetterCard/>
      <SectionDivider/>
      <HowItWorks/>
      
      <WhyChooseUs/>
    </div>
    </>
  )
}
