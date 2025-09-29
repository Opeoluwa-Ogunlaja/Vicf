import { memo } from 'react'
import NavigationBar from './NavigationBar'
import HeroSection from './HeroSection'
import ButtressSection from './ButtressSection'
import FeaturesSection from './FeaturesSection'

const Landing = () => {
  return (
    <div className="grid gap-8 bg-[#FEFEFF]">
      <NavigationBar />
      <HeroSection />
      <ButtressSection />
      <FeaturesSection />
    </div>
  )
}

export default memo(Landing)
