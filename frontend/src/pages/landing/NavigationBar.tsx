import { VicfIcon } from '@/assets/icons'
import { Link } from 'react-router-dom'

const NavigationBar = () => {
    
return <header className="main-navigation relative w-full h-max border-b border-neutral-50 px-16 max-md:px-8 max-sm:px-3 bg-white drop-shadow-sm">
      <div className="flex items-center justify-between self-start py-6">
        <div className="gap-4 max-lg:flex lg:contents">
          <Link to="/home" className="text-5xl max-md:text-3xl">
            <VicfIcon width={'1em'} />
          </Link>
        </div>

        <nav className="contents">
          <ul className="flex items-center gap-6 max-lg:gap-4">
            <li>
              <a href="">
                
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
}

export default NavigationBar