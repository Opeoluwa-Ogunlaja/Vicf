import mongoose from 'mongoose'
import { mongoUrl } from './index'

export async function dbConnection() {
  try {
    await mongoose.connect(mongoUrl)
    console.log('DB Connected')
  } catch (error) {
    console.error(error)
  }
}
