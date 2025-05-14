import { nodeEnv, port } from './config'
import { dbConnection } from './config/dbConnection'
import { server } from './server'
import { connectSocketIo } from './socket'

console.log(nodeEnv)
dbConnection()
connectSocketIo()
server.listen(port, () => {
  console.log('Server is currently listening at port 3002')
})
