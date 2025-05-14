import mongoose from 'mongoose'

export function newId() {
  return new mongoose.Types.ObjectId()
}
