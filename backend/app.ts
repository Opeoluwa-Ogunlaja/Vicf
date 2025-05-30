import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routers/userRouter'
import { errorHandler } from './lib/middleware/handlers/errorHandlers'
import contactsRouter from './routers/contactsRouter'
import organisationsRouter from './routers/organisationsRouter'
import path from 'path'
import { nodeEnv } from './config'

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use('/users', userRouter)
app.use('/contacts', contactsRouter)
app.use('/organisations', organisationsRouter)

if (nodeEnv == 'production') {
  app.use(express.static(path.join(__dirname, 'client')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'))
  })
}

app.use(errorHandler)

export default app
