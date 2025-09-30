import { ArrowLeftIcon, ArrowRightIcon } from '@/assets/icons';
import clsx from 'clsx';
import { FC, memo, ReactEventHandler } from 'react'
import Slider from 'react-slick'

const PrevArrow: FC<{ className?: string, style?: Record<string, string>, onClick?: ReactEventHandler<HTMLButtonElement>}>  = memo(({ className, style, onClick }) => (
  <button
    className={clsx("absolute left-4 top-1/2 -translate-y-1/2 z-10 transition text-neutral-500 hover:text-neutral-600", className)}
    onClick={onClick}
    style={{ ...style }}
  >
    <ArrowLeftIcon />
  </button>
));

const NextArrow: FC<{ className?: string, style?: Record<string, string>, onClick?: ReactEventHandler<HTMLButtonElement>}>  = memo(({ className, style, onClick }) => (
  <button
    className={clsx("absolute right-4 top-1/2 -translate-y-1/2 z-10 transition text-neutral-500 hover:text-neutral-600", className)}
    onClick={onClick}
    style={{ ...style }}
  >
    <ArrowRightIcon />
  </button>
));

const TestimonialsSection = () => {
  const settings = {
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  }

  const data = [
    {
      img: '/assets/offline-first.png',
      name: 'Opeoluwa Ogunlaja',
      position: "Fullstack Developer",
      quo: "So useful for quick networking. A gem!"
    },
    {
      img: '/assets/sync-online.png',
      name: 'Samuel',
      position: "Graphics Designer",
      quo: "This is so useful for my church. We use it to manage first timer lists efficiently"
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