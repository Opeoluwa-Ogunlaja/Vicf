import MongooseDAL from '../data access layers/MongooseDal'

export interface Repository {
  dal: T extends MongooseDAL ? T : never
}
