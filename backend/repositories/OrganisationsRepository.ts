import { RootFilterQuery } from 'mongoose'
import MongooseDAL from '../data access layers/MongooseDal'
import Organisation, { OrganisationModelType } from '../entities/Organisation'
import { createOrganisationType } from '../lib/validators/zodSchemas'
import { IContactGroup, IOrganisationDocument, IOrganisation } from '../types'

export class OrganisationRepository {
  // --- TEMPLATE: Add OrganisationRepository Methods ---
  async update_organisation(organisationId: string, data: Partial<IOrganisationDocument>) {
    // TODO: Implement update organisation
    return null
  }

  async delete_organisation(organisationId: string) {
    // TODO: Implement delete organisation
    return null
  }

  async invite_member(organisationId: string, memberId: string) {
    // TODO: Implement invite member
    return null
  }

  async remove_member(organisationId: string, memberId: string) {
    // TODO: Implement remove member
    return null
  }
  // --- END TEMPLATE ---
  dal: MongooseDAL<IOrganisationDocument, OrganisationModelType>
  runInTransaction: typeof this.dal.runInTransaction
  constructor(model: any) {
    this.dal = new MongooseDAL<IOrganisationDocument, OrganisationModelType>(model)
    this.runInTransaction = this.dal.runInTransaction
  }

  getModel(){
    return this.dal.getModel()
  }

  async create(data: Partial<IOrganisation>) {
    return await this.dal.create({...data });
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
