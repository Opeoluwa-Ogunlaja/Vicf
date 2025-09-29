import { CollaborationIllustration } from "@/assets/illustrations"

const ButtressSection = () => {
  return (
    <section className="">
      <div className="flex flex-col items-center gap-8">
        <CollaborationIllustration className="max-md:w-[300px] w-[605px]"/>
        <p className="leading-7 text-neutral-500 max-md:max-w-[56ch] max-w-[64ch] mx-4">Built for both solo users and collaborative teams, the app lets you update contact lists offline and sync effortlessly when you're back online. Invite teammates, share access with permission control, and stay in sync no matter where you are or how you work.</p>
      </div>
    </section>
  )
}

export default ButtressSection