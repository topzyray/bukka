import { Inject, Injectable } from '@nestjs/common';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import { BusinessCategory } from 'src/DomainLayer/Models/BusinessCategory';
import { PagedData } from 'src/DomainLayer/Models/PagedData';

@Injectable()
export class BusinessCategoryDataAgent {
  private readonly model: ModelProxy<BusinessCategory>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<BusinessCategory>('businessCategory');
  }

  async createCategory(
    data: Partial<BusinessCategory>,
  ): Promise<BusinessCategory> {
    return await this.model.insert(data);
  }

  async findById(id: number): Promise<BusinessCategory | null> {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    return await this.model.findOne(spec);
  }

  async findBySlug(slug: string): Promise<BusinessCategory | null> {
    const spec: QuerySpec = {
      filter: { field: 'slug', op: 'eq', value: slug },
    };
    return await this.model.findOne(spec);
  }

  async findAll(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<BusinessCategory[]>> {
    const pageData = new PagedData<BusinessCategory[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    const spec: QuerySpec = {
      filter,
      sort: [{ field: 'name', direction: 'asc' }],
      pagination: { page: pageNumber, pageSize },
    };

    const total = await this.model.count({ filter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);
    pageData.data = await this.model.find(spec);
    return pageData;
  }

  async updateCategory(
    id: number,
    updateData: Partial<BusinessCategory>,
  ): Promise<BusinessCategory> {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    return (await this.model.updateOne(spec, updateData)) as BusinessCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    await this.model.deleteOne(spec);
  }
}
