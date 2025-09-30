import { StarsBgIllustration, StarsIllustration } from '@/assets/illustrations'
import Slider from 'react-slick'

const FeaturesSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 3000
    // appendDots: (dots: any[]) => {
    //   return (
    //   <div
    //     className='flex gap-2'
    //   >
    //     <ul style={{ margin: "0px" }}> {dots.map(Dot => {
    //       return <div key={Dot} className={clsx('bg-muted w-6 aspect-square slideshow-dot rounded-full', { 'bg-primary': Dot.props.className == 'slick-active' })}>{Dot}</div>
    //     })} </ul>
    //   </div>
    // )}
  }

  const data = [
    {
      img: '/assets/offline-first.png',
      head: 'Offline-first contact management',
      desc: "Keep your contact list updated even when you're offline. Perfect for solo travelers, field workers, and offline-first use cases."
    },
    {
      img: '/assets/sync-online.png',
      head: "Automatic sync when you're online",
      desc: "Syncs securely in the background as soon as you're connected without any hassle."
    },
    {
      img: '/assets/smart-res.png',
      head: 'Smart conflict resolution',
      desc: 'We help you resolve differences if two versions of a contact clash during sync.'
    },
    {
      img: '/assets/security.png',
      head: 'Secure and private',
      desc: 'Your contact data stays yours. Encrypted and stored with privacy in mind.'
    }
  ]
  return (
    <section className="relative mt-16">
      <div className="absolute -left-4 -translate-y-1/2">
        <StarsIllustration className="w-[200px] x:w-[400px]" />
      </div>
      <h1 className="text-center text-xl font-bold mb-4">Core Features</h1>
      <div
        className="slider-container relative isolate mx-auto mt-8 self-stretch"
        style={{
          width: 'calc(90cqw - 48px)'
        }}
      >
        <div className="absolute top-[20%] xl:top-[15%] right-0 md:-right-48 -translate-y-1/2 -translate-x-1/2 opacity-80">
          <StarsBgIllustration style={{ width: "clamp(200px,calc(45dvw - 48px),550px)"}} />
        </div>
        <Slider {...settings}>
          {data.map((feature, i) => {
            return (
              <div key={feature.head}>
                <div className="grid items-center gap-4 max-md:gap-2 md:grid-flow-col">
                  <img loading="lazy" src={feature.img} alt={feature.head} />
                  <div className="flex flex-col">
                    <h2 className="text-[96px] font-bold text-primary max-md:mx-auto">{i + 1}</h2>
                    <h3 className="text-[32px] font-bold max-md:text-center">{feature.head}</h3>
                    <p className="font-medium text-neutral-500 max-md:text-center">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </Slider>
      </div>
    </section>
  )
}

export default FeaturesSection
