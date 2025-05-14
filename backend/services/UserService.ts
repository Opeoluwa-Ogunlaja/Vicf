import { UserRepository, userRepository } from '../repositories/UserRepository'
import { IUser, Repository } from '../types'

export class UserService {
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
}

const userService = new UserService(userRepository)

export default userService
