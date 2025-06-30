import { RootFilterQuery } from 'mongoose'
import MongooseDAL from '../data access layers/MongooseDal'
import Organisation, { OrganisationModelType } from '../entities/Organisation'
import { createOrganisationType } from '../lib/validators/zodSchemas'
import { IOrganisationDocument } from '../types'

export class OrganisationRepository {
  dal: MongooseDAL<IOrganisationDocument, OrganisationModelType>
  constructor(model: any) {
    this.dal = new MongooseDAL<IOrganisationDocument, OrganisationModelType>(model)
  }

  async create({ name }: createOrganisationType) {
    return await this.dal.create({
      name
    })
  }

  async findAll(query: RootFilterQuery<IOrganisationDocument>, ...args: any[]) {
    return await this.dal.getMany(query)
  }

  async findOne(query: RootFilterQuery<IOrganisationDocument>, ...args: any[]) {
    return await this.dal.getOne(query, ...args)
  }

  async findById(id: string, ...args: any[]) {
    return await this.dal.getById(id)
  }

  updateById: typeof this.dal.updateById = async (id, data) => {
    return await this.dal.updateById(id, data)
  }
}

export const organisationRepository = new OrganisationRepository(Organisation)
