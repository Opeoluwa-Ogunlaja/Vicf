import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient.ts'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { registerServiceWorker } from './serviceWorker'

// registerServiceWorker()

// navigator.serviceWorker.register('/service-worker.js').then(registration => {
//   registration.onupdatefound = () => {
//     const installingWorker = registration.installing
//     if (installingWorker) {
//       installingWorker.onstatechange = () => {
//         if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
//           window.location.reload()
//         }
//       }
//     }
//   }
// })

createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <App />
  </QueryClientProvider>
  // </React.StrictMode>
)
