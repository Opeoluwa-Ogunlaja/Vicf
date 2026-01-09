import { memo } from 'react'
import NavigationBar from './NavigationBar'
import HeroSection from './HeroSection'
import ButtressSection from './ButtressSection'
import FeaturesSection from './FeaturesSection'
import Footer from '../../components/Footer'
import FAQSection from './FAQSection'
import TestimonialsSection from './TestimonialsSection'
import CajoleSection from './CajoleSection'

const Landing = () => {
  return (
    <>
      <main className="landing sgrid gap-8 overflow-x-hidden bg-[#FEFEFF]">
        <NavigationBar />
        <HeroSection />
        <ButtressSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
        <CajoleSection />
      </main>
      <Footer className="mt-0" />
    </>
  )
}

export default memo(Landing)
