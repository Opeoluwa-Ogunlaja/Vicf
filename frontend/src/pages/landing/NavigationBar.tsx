import { VicfIcon } from '@/assets/icons'
import NavigationCard from '@/components/NavigationCard'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/useUser'
import { Link, useNavigate } from 'react-router-dom'

const NavigationBar = () => {
  const { loggedIn } = useUser()
  const navigate = useNavigate()
    
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
              {!loggedIn ? 
               <Button variant="secondary" onClick={() => navigate("/auth")} className="mt-2 w-fit px-12 py-5 max-md:mx-auto max-md:justify-self-center">Get Started</Button>
                :
               <NavigationCard />
              }  
            </li>
          </ul>
        </nav>
      </div>
    </header>
}

export default NavigationBar