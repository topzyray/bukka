@Injectable()
export class ServiceDataAgent {
  private readonly model: ModelProxy<Service>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER) private db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<Service>('service');
  }

  async createService(data: Partial<Service>): Promise<Service> {
    return this.model.insert(data);
  }

  async findById(id: number): Promise<Service | null> {
    return this.model.findOne({ filter: { field: 'id', op: 'eq', value: id } });
  }

  async findByFilters(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<Service[]>> {
    const pageData = new PagedData<Service[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    const total = await this.model.count({ filter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);
    pageData.data = await this.model.find({
      filter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
    });

    return pageData;
  }

  async updateService(id: number, data: Partial<Service>): Promise<Service> {
    return this.model.updateOne(
      { filter: { field: 'id', op: 'eq', value: id } },
      data,
    ) as Promise<Service>;
  }

  async deleteService(id: number): Promise<void> {
    await this.model.deleteOne({
      filter: { field: 'id', op: 'eq', value: id },
    });
  }
}
