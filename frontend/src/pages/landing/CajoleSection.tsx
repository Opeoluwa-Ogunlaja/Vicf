import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/useUser'
import { useNavigate } from 'react-router-dom'

const CajoleSection = () => {
  const { loggedIn } = useUser()
  const navigate = useNavigate()

  return (
    <section className="mt-6 flex flex-col items-center gap-6 bg-secondary py-16">
      <h2 className="text-2xl font-bold max-md:text-xl">Let's Get Started</h2>
      {!loggedIn ? (
        <Button onClick={() => navigate('/auth')} className="w-fit px-10 py-6 text-white">
          Get Started
        </Button>
      ) : (
        <Button onClick={() => navigate('/home')} className="w-fit px-10 py-6 text-white">
          Continue to Home
        </Button>
      )}
    </section>
  )
}

export default CajoleSection
