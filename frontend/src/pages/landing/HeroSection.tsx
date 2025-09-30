import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/useUser"
import { useNavigate } from "react-router-dom"

const HeroSection = () => {
  const navigate = useNavigate()
  const { loggedIn } = useUser()

  return (
    <div className="grid min-h-[750px] bg-[#F2F2FE]/20 max-xl:gap-6 px-16 xl:grid-flow-col -mt-2">
        <div className="xl:mt-[140px] mt-[20px] flex flex-col gap-4 max-xl:text-center z-10">
            <h2 className="max-w-[22ch] max-xl:mx-auto max-md:text-center text-5xl font-bold tracking-heading leading-[80px] max-xl:text-3xl">Contact Management for Individuals & Teams</h2>
            <p className="text-neutral-500 max-xl:text-center xl:max-w-[60ch] font-medium">Whether you’re managing your own network or collaborating across a team, our contact manager keeps everyone organized—even offline.</p>
            {!loggedIn ? 
              <Button variant="secondary" onClick={() => navigate('/auth')} className="mt-2 w-fit px-12 py-5 max-xl:mx-auto max-xl:justify-self-center">Get Started</Button>
              :
              <Button variant="secondary" onClick={() => navigate('/home')} className="mt-2 w-fit px-12 py-5 max-xl:mx-auto max-xl:justify-self-center">Continue to Home</Button>
            }
        </div>
        <picture className="xl:absolute justify-self-center xl:justify-self-end xl:-mr-16 max-xl:-ml-4 -mt-4 max-xl:w-[70vw]">
            <source srcSet="/showcase.webp" media="(width >= 1280px)" />
            <source srcSet="/showcase-small.webp" media="(width < 1280px)" />
            <img loading="lazy" src="/showcase.webp" alt="Show off" />
        </picture>
    </div>
  )
}

export default HeroSection