import { Inject, Injectable } from '@nestjs/common';
import { Order } from 'src/DomainLayer/Models/Order';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import type { IDatabaseAdapter, ModelProxy } from '../Adapters/DatabaseAdapter';

@Injectable()
export class OrderDataAgent {
  private readonly model: ModelProxy<Order>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER) private db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<Order>('order');
  }

  async createOrder(data: Partial<Order>): Promise<Order> {
    return this.model.insert(data);
  }

  async findById(id: number): Promise<Order | null> {
    return this.model.findOne({
      filter: { field: 'id', op: 'eq', value: id },
      extras: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
          vendor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
          rider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
          business: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      },
    });
  }

  async getById(id: number) {
    return this.findById(id);
  }

  async findByFilters(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<Order[]>> {
    const pageData = new PagedData<Order[]>();
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
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
          vendor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
          rider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
          business: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      },
    });

    return pageData;
  }

  async updateOrder(id: number, data: Partial<Order>): Promise<Order> {
    return this.model.updateOne(
      { filter: { field: 'id', op: 'eq', value: id } },
      data,
    ) as Promise<Order>;
  }

  async deleteOrder(id: number): Promise<void> {
    await this.model.deleteOne({
      filter: { field: 'id', op: 'eq', value: id },
    });
  }
}
