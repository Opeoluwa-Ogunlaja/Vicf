import { ClientSession } from 'mongoose'
import { UserRepository, userRepository } from '../repositories/UserRepository'
import { IUser, Repository } from '../types'

export class UserService {
  // --- TEMPLATE: Add UserService Methods ---
  async update_user(userId: string, data: Partial<IUser>) {
    // TODO: Implement update user
    return null
  }

  async delete_user(userId: string) {
    // TODO: Implement delete user
    return null
  }

  async change_password(userId: string, newPassword: string) {
    // TODO: Implement change password
    return null
  }
  // --- END TEMPLATE ---
  repository: UserRepository
  constructor(repository: UserRepository) {
    this.repository = repository
  }

  async create_user(user: Partial<IUser> & { _id?: string }) {
    return await this.repository.create(user as IUser)
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return await this.repository.updateById(userId, { refreshToken })
  }

  get_user: typeof userRepository.findOne = async query => {
    return this.repository.findOne(query)
  }

  get_user_by_id: typeof userRepository.findById = async id => {
    return this.repository.findById(id)
  }

  complete_verification = async (id: string) => {
    return this.repository.updateById(id, {
      verified: true
    })
  }

  verifyPassword(doc: any, password: string){
    return doc.isPasswordMatched(password)
  }

  add_contact_group_to_user = async (userId: string, groupId: string, session?: ClientSession) => {
    await this.repository.updateById(
      userId,
      {
        $push: {
          contact_groupings: groupId
        }
      },
      session
    )
  }

  add_user_to_organisation = async (userId: string, organisationID: string) => {
    return true
  }
}

const userService = new UserService(userRepository)

export default userService
