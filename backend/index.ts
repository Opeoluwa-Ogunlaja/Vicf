import { dbConnection } from './config/dbConnection'
import { server } from './server'
import { connectSocketIo } from './socket'

dbConnection()
connectSocketIo()
server.listen(3002, () => {
  console.log('Server is currently listening at port 3002')
})
