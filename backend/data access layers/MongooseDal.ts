// Data Access Layer On top of Mongoose for Orthogonality
import mongoose, { Model, UpdateQuery, RootFilterQuery, ClientSession } from 'mongoose'

function isClientSession(session: any): session is ClientSession {
  return !!session && typeof (session as any).startTransaction === 'function'
}

class MongooseDAL<TDocument = any, TModel extends Model<TDocument> = any> {
  private model: TModel
  constructor(model: TModel) {
    this.model = model
  }

  getModel(): TModel {
    return this.model
  }

  async runInTransaction<T>(
    callback: (session?: ClientSession) => Promise<T>,
    inheritedSession?: ClientSession
  ): Promise<T | null> {
    const session =
      inheritedSession && isClientSession(inheritedSession)
        ? inheritedSession
        : await mongoose.startSession()

    try {
      let result: T
      await session.withTransaction(async () => {
        result = await callback(session)
      })
      return result!
    } finally {
      session.endSession()
    }

    return null
  }

  async create(arg1: Partial<TDocument>, session?: ClientSession) {
    const stage = new this.model(arg1)
    const doc = await stage.save({ session })
    return doc
  }

  async getById(id: string, session?: ClientSession) {
    const doc = await this.model.findById(id).session(session || null)
    return doc
  }

  async getMany(query: RootFilterQuery<TDocument>, session?: ClientSession) {
    return await this.model.find(query).session(session || null)
  }

  async getOne(query: RootFilterQuery<TDocument>, session?: ClientSession) {
    return await this.model.findOne(query).session(session || null)
  }

  async updateById<T>(id: T, data: UpdateQuery<TDocument>, session?: ClientSession) {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).session(session || null)
  }

  async updateMany(
    query: RootFilterQuery<TDocument>,
    data: UpdateQuery<TDocument>,
    session?: ClientSession
  ) {
    return await this.model.updateMany(query, data).session(session || null)
  }

  async delete<T>(id: T, session?: ClientSession) {
    return await this.model.findByIdAndDelete(id).session(session || null)
  }

  async deleteMany(query: RootFilterQuery<TDocument>, session?: ClientSession) {
    return await this.model.deleteMany(query).session(session || null)
  }

  async deleteOne(query: RootFilterQuery<TDocument>, session?: ClientSession) {
    return await this.model.findOneAndDelete(query).session(session || null)
  }

  async aggregate<T = TDocument>(...args: any[]) {
    const lastElement = args.at(-1)
    if (isClientSession(lastElement)) {
      return await this.model.aggregate<T>(...args.slice(0, -1)).session(lastElement)
    }

    return await this.model.aggregate<T>(...args)
  }
}

export type MongoDAl = typeof MongooseDAL
export default MongooseDAL
