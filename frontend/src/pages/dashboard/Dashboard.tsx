import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'

const Dashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null)
  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data.data))
  }, [])

  return (
      <div className="max-w-2xl mx-auto py-10">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <div className="grid gap-6">
          <Card className="p-6">
            <div className="font-semibold">Listings Created</div>
            <div className="text-3xl">{stats?.listingsCreated ?? '...'}</div>
          </Card>
          <Card className="p-6">
            <div className="font-semibold">Listings Updated to Drive</div>
            <div className="text-3xl">{stats?.listingsUpdatedToDrive ?? '...'}</div>
          </Card>
        </div>
      </div>
  )
}

export default Dashboard
