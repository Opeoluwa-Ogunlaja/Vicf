import { RootFilterQuery } from 'mongoose'
import MongooseDAL from '../data access layers/MongooseDal'
import User, { UserModelType } from '../entities/User'
import { userRegisterType } from '../lib/validators/zodSchemas'
import { IUser, IUserDocument } from '../types'

export class UserRepository {
  // --- TEMPLATE: Add UserRepository Methods ---
  async update_user(userId: string, data: Partial<IUser>) {
    // TODO: Implement update user
    return null
  }

  async delete_user(userId: string) {
    // TODO: Implement delete user
    return null
  }
  // --- END TEMPLATE ---
  dal: MongooseDAL<IUserDocument, UserModelType>
  runInTransaction: typeof this.dal.runInTransaction
  constructor(model: any) {
    this.dal = new MongooseDAL<IUserDocument, UserModelType>(model)
    this.runInTransaction = this.dal.runInTransaction
  }

  async create({ email, password, name, profile_photo }: IUser) {
    return await this.dal.create({
      email,
      password,
      name,
      profile_photo
    })
  }

  async findOne(query: RootFilterQuery<IUserDocument>, ...args: any[]) {
    return await this.dal.getOne(query, ...args)
  }

  async findById(id: string, ...args: any[]) {
    return await this.dal.getById(id)
  }

  updateById: typeof this.dal.updateById = async (id, data, session) => {
    return await this.dal.updateById(id, data, session)
  }
}

export const userRepository = new UserRepository(User)
