import { useState } from 'react'

const Subscription = () => {
  // @typescript-eslint/no-explicit-any
  const [status, setStatus] = useState<unknown>(null)
  const handleSubscribe = async () => {
    // Call backend endpoint for subscription
    setStatus('pending')
    try {
      const res = await fetch('/api/subscribe', { method: 'POST' })
      if (res.ok) setStatus('active')
      else setStatus('failed')
    } catch (e) {
      setStatus('failed')
      console.error(e)
    }
  }
  return (
    <div style={{ padding: 32 }}>
      <h2>Subscription</h2>
      <p>Status: {status as string || 'none'}</p>
      <button onClick={handleSubscribe}>Subscribe to Premium</button>
    </div>
  )
}

export default Subscription
