import Hero from '@/components/home/Hero'
import HowItWorks from '@/components/home/HowItWorks'
import LetterCard from '@/components/home/LetterCard'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import SignatureForm from '@/components/letter/SignatureForm'
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

      <SignatureForm/>
    </div>
    </>
  )
}
