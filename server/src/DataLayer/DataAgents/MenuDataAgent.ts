import { Menu } from 'src/DomainLayer/Models/Menu';
import { Inject, Injectable } from '@nestjs/common';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import {
  type IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';

@Injectable()
export class MenuDataAgent {
  private readonly model: ModelProxy<Menu>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER) private db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<Menu>('menu');
  }

  async createMenu(data: Partial<Menu>): Promise<Menu> {
    return this.model.insert(data);
  }

  async findById(id: number): Promise<Menu | null> {
    return this.model.findOne({ filter: { field: 'id', op: 'eq', value: id } });
  }

  async getById(id: number) {
    return this.findById(id);
  }

  async findByFilters(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<Menu[]>> {
    const pageData = new PagedData<Menu[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    const total = await this.model.count({ filter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);
    pageData.data = await this.model.find({
      filter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
      extras: {
        include: {
          business: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    });

    return pageData;
  }

  async updateMenu(id: number, data: Partial<Menu>): Promise<Menu> {
    return this.model.updateOne(
      { filter: { field: 'id', op: 'eq', value: id } },
      data,
    ) as Promise<Menu>;
  }

  async deleteMenu(id: number): Promise<void> {
    await this.model.deleteOne({
      filter: { field: 'id', op: 'eq', value: id },
    });
  }
}
