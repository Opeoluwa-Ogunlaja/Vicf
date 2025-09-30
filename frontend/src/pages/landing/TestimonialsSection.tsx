import Slider from 'react-slick'


const TestimonialsSection = () => {
  const settings = {
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
  }

  const data = [
    {
      img: '/assets/offline-first.png',
      name: 'John Doe',
      position: "Sales Manager",
      quo: "Keep your contact list updated even when you're offline. Perfect for solo travelers, field workers, and offline-first use cases."
    },
    {
      img: '/assets/sync-online.png',
      name: 'Jane Doe',
      position: "Sales Manager",
      quo: "Syncs securely in the background as soon as you're connected without any hassle."
    }
  ]
  return (
    <section className='mt-16'>
      <h1 className="text-xl font-bold text-center">Testimonials</h1>
      <div
        className="slider-container relative mx-auto self-stretch mt-4 max-md:max-w-[340px] max-w-[450px]"
      >
        <Slider {...settings}>
          {data.map(feature => {
            return (
              <div key={ feature.name }>
                <div className="grid grid-flow-row items-center max-md:gap-2 gap-4">
                  <img loading='lazy' src={feature.img} className='shadow-inner !w-[80px] mx-auto aspect-square rounded-full' alt={feature.name} />
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-center">{feature.name}</h3>
                    <h4 className="text-sm font-medium text-center text-neutral-400">{feature.position}</h4>
                    <p className="p-1 testimonial-quote text-center mx-auto mt-2 font-playfair">{feature.quo}</p>
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

export default TestimonialsSection