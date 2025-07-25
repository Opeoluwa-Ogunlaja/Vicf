import { RootFilterQuery } from 'mongoose'
import MongooseDAL from '../data access layers/MongooseDal'
import Organisation, { OrganisationModelType } from '../entities/Organisation'
import { createOrganisationType } from '../lib/validators/zodSchemas'
import { IContactGroup, IOrganisationDocument } from '../types'

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

  async getOrganisationWithListings(listing_id: string) {
    return await this.dal
      .getModel()
      .findById(listing_id)
      .populate<{ contact_groupings: IContactGroup[] }>('contact_groupings')
  }

  updateById: typeof this.dal.updateById = async (id, data) => {
    return await this.dal.updateById(id, data)
  }
}

export const organisationRepository = new OrganisationRepository(Organisation)
