import app from './app'
import { createServer } from 'http'

export const server = createServer(app)
