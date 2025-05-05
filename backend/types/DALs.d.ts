export interface DAL<TDocument, TModelType> {
  model: TModelType

  getModel(): TModelType

  create(document: Partial<TDocument>, ...args: any[]): Promise<TDocument | null>

  getById(id: string): Promise<TDocument | null>

  getMany<QueryWrapper = Partial>(
    query: QueryWrapper<TDocument>,
    ...args: any[]
  ): Promise<TDocument[]>

  getOne<QueryWrapper = Partial>(query: QueryWrapper<TDocument>): Promise<TDocument | null>

  updateById<UpdateWrapper = Partial>(
    id: string,
    data: UpdateWrapper<TDocument>,
    ...args: any[]
  ): Promise<TDocument | null>

  updateMany<QueryWrapper = Partial, UpdateWrapper = Partial, T = any>(
    query: QueryWrapper<TDocument>,
    data: UpdateWrapper<TDocument>,
    ...args: any[]
  ): Promise<T>

  deleteById<QueryWrapper = Partial>(id: string, ...args: any[]): Promise<TDocument | null>

  deleteMany<QueryWrapper = Partial, T = any>(
    query: QueryWrapper<TDocument>,
    ...args: any[]
  ): Promise<T>

  deleteOne<QueryWrapper = Partial>(
    query: QueryWrapper<TDocument>,
    ...args: any[]
  ): Promise<TDocument | null>
}
