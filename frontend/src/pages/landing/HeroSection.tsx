import { Button } from "@/components/ui/button"

const HeroSection = () => {
  return (
    <div className="grid min-h-[750px] bg-[#F2F2FE]/20 max-md:gap-6 px-16 md:grid-flow-col">
        <div className="md:mt-[140px] mt-[20px] flex flex-col gap-4 max-md:text-center">
            <h2 className="max-w-[22ch] text-5xl font-bold tracking-heading leading-[80px] max-md:text-3xl">Contact Management for Individuals & Teams</h2>
            <p className="text-neutral-500 max-w-[60ch] font-medium">Whether you’re managing your own network or collaborating across a team, our contact manager keeps everyone organized—even offline.</p>
            <Button variant="secondary" className="mt-2 w-fit px-12 py-5 max-sm:justify-self-center">Get Started</Button>
        </div>
        <picture className="md:absolute justify-self-end -mr-16 -mt-4 max-md:w-[300px]">
            <source srcSet="./showcase.webp" media="(width >= 800px)" />
            <img src="./showcase.webp" alt="Show off" />
        </picture>
    </div>
  )
}

export default HeroSection