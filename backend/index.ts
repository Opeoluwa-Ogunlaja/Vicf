import { nodeEnv } from './config'
import { dbConnection } from './config/dbConnection'
import { server } from './server'
import { connectSocketIo } from './socket'

console.log(nodeEnv)
dbConnection()
connectSocketIo()
server.listen(3002, () => {
  console.log('Server is currently listening at port 3002')
})
