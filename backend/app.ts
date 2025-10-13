import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './routers/userRouter'
import { errorHandler } from './lib/middleware/handlers/errorHandlers'
import contactsRouter from './routers/contactsRouter'
import organisationsRouter from './routers/organisationsRouter'
import path from 'path'
import { nodeEnv } from './config'
import subscriptionRouter from './routers/subscriptionRouter'
import dashboardRouter from './routers/dashboardRouter'
import { authMiddleware } from './lib/middleware/users/authMiddleware'

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use(cors({ origin: (o, cb) => cb(null, true), credentials: true }))

app.use(authMiddleware)

app.use('/api/users', userRouter)
app.use('/api/contacts', contactsRouter)
app.use('/api/organisations', organisationsRouter)
app.use('/api/subscribe', subscriptionRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/ping', (req, res) => {
  res.sendStatus(200)
})

if (nodeEnv == 'production') {
  app.use(express.static(path.join(__dirname, 'client')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'))
  })
}

app.use(errorHandler)

export default app
