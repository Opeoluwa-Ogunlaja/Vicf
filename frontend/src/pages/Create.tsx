import { Suspense } from 'react'
import { Await, useRouteLoaderData } from 'react-router-dom'
import LoadingScreen from '../components/LoadingScreen'

const CreateLayout = ({ name }: { name: string }) => {
  return <div className="animate-in opacity-100">Hello mr {name}</div>
}

const Create = () => {
  const { promise } = useRouteLoaderData('root') as { promise: { name: string } }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Await resolve={promise} errorElement={<>Error</>}>
        {({ name }) => <CreateLayout name={name} />}
      </Await>
    </Suspense>
  )
}

export default Create
