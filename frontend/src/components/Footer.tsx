import { FacebookIcon, InstagramIcon, VicfIcon } from '@/assets/icons'
import { NavigationLink } from './ui/navigation-link'

const Footer = () => {
  return (
    <footer className="relative mt-20 flex items-center justify-center self-end bg-secondary/20 p-14 max-md:flex-col max-md:gap-8 max-sm:px-10">
      <h2 className="inline-block text-6xl max-md:text-4xl">
        <VicfIcon width={'1em'} />
      </h2>
      <nav className="text-sm font-medium text-muted md:ml-6">
        <ul className="flex gap-4 text-center max-md:flex-col max-md:justify-center">
          <li>
            <NavigationLink to="/home">Home</NavigationLink>
          </li>
          <li>
            <NavigationLink to="/dashboard">Dashboard</NavigationLink>
          </li>
          <li>
            <NavigationLink to="/save">Save Contacts</NavigationLink>
          </li>
        </ul>
      </nav>
      <ul className="max-md-justify-center flex gap-4 text-xl md:ml-auto">
        <li>
          <a>
            <FacebookIcon width={'1em'} />
          </a>
        </li>
        <li>
          <a>
            <InstagramIcon width={'1em'} />
          </a>
        </li>
      </ul>
      <span className="absolute inset-x-0 -bottom-2 m-4 mx-auto w-max text-center text-xs text-muted">
        Copyright <VicfIcon width="20px" className="inline-block align-baseline text-neutral-600" />{' '}
        2023
      </span>
    </footer>
  )
}

export default Footer
