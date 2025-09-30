import { memo } from 'react'
import NavigationBar from './NavigationBar'
import HeroSection from './HeroSection'
import ButtressSection from './ButtressSection'
import FeaturesSection from './FeaturesSection'
import Footer from '../../components/Footer'
import { Button } from '@/components/ui/button'
import FAQSection from './FAQSection'
import TestimonialsSection from './TestimonialsSection'

const Landing = () => {
  return (
    <>
    <main className="grid gap-8 bg-[#FEFEFF]">
      <NavigationBar />
      <HeroSection />
      <ButtressSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <section className='bg-secondary flex flex-col gap-6 items-center py-16 mt-6'>
        <h2 className="text-2xl max-md:text-xl font-bold">Let's Get Started</h2>
        <Button className='w-fit px-10 py-6 text-white'>Get Started</Button>
      </section>
      
    </main>
    <Footer className='mt-0'/>
    </>
  )
}

export default memo(Landing)
