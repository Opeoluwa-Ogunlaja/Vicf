import { nodeEnv, port } from './config'
import { dbConnection } from './config/dbConnection'
import { server } from './server'
import { connectSocketIo } from './socket'
import { createClient } from 'redis'
import { createAdapter } from '@socket.io/redis-adapter'

dbConnection()
;(async () => {
  const io = await connectSocketIo()

  if (nodeEnv !== 'production') {
    const pubClient = createClient({ url: 'redis://localhost:6379' })
    const subClient = pubClient.duplicate()

    await Promise.all([pubClient.connect(), subClient.connect()])

    io!.adapter(createAdapter(pubClient, subClient))
  }

  server.listen(port, () => {
    console.log('Server is currently listening at port 3002')
  })
})()
