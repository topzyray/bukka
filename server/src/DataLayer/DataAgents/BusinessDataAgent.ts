import { Inject, Injectable } from '@nestjs/common';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import { Business } from 'src/DomainLayer/Models/Business';
import { PagedData } from 'src/DomainLayer/Models/PagedData';

@Injectable()
export class BusinessDataAgent {
  private readonly model: ModelProxy<Business>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<Business>('business');
  }

  async createBusiness(data: Partial<Business>): Promise<Business> {
    return this.model.insert(data);
  }

  async findById(id: number): Promise<Business | null> {
    const spec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: id },
      extras: {
        include: {
          category: true,
          location: true,
          reviews: true,
          owner: true,
          recommender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    };
    return this.model.findOne(spec);
  }

  async getById(id: number) {
    return this.findById(id);
  }

  async findByLocation(locationId: number): Promise<Business | null> {
    if (!locationId) {
      return null;
    }

    const spec: QuerySpec = {
      filter: { field: 'locationId', op: 'eq', value: locationId },
    };
    return this.model.findOne(spec);
  }

  async findByOwnerId(ownerId: number): Promise<Business[]> {
    const spec: QuerySpec = {
      filter: { field: 'ownerId', op: 'eq', value: ownerId },
    };
    return this.model.find(spec);
  }

  async findAll(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<Business[]>> {
    const pageData = new PagedData<Business[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    const spec: QuerySpec = {
      filter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
      extras: {
        include: {
          category: true,
          location: true,
          owner: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          recommender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    };
    const total = await this.model.count({ filter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);
    pageData.data = await this.model.find(spec);
    return pageData;
  }

  async findFeaturedBusinesses(
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<Business[]>> {
    const pageData = new PagedData<Business[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    const filter = { field: 'isFeatured', op: 'eq', value: true };

    const spec: QuerySpec = {
      filter,
      sort: [
        { field: 'featuredRank', direction: 'asc' },
        { field: 'featuredStart', direction: 'desc' },
      ],
      pagination: { page: pageNumber, pageSize },
      extras: {
        include: {
          category: true,
          location: true,
          owner: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          recommender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    };
    const total = await this.model.count({ filter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);
    pageData.data = await this.model.find(spec);
    return pageData;
  }

  async updateBusiness(
    id: number,
    updateData: Partial<Business>,
  ): Promise<Business> {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    return (await this.model.updateOne(spec, updateData)) as Business;
  }

  async deleteBusiness(id: number): Promise<void> {
    const spec: QuerySpec = { filter: { field: 'id', op: 'eq', value: id } };
    await this.model.deleteOne(spec);
  }

  async deleteAllUserBusinesses(userId: number) {
    const spec: QuerySpec = {
      filter: { field: 'userId', op: 'eq', value: userId },
    };
    const result = await this.model.deleteMany(spec);
    return result;
  }

  // async connectBusnessFile(businessId: number, fileId: number) {
  //   const spec: QuerySpec = {
  //     filter: { field: 'id', op: 'eq', value: businessId },
  //     extras: {
  //       include: {
  //         files: true,
  //       },
  //     },
  //   };
  //   const updateData = {
  //     restaurantFiles: {
  //       connect: { id: fileId },
  //     },
  //   };
  //   return await this.model.updateOne(spec, updateData as any);
  // }

  // async connectBusinessFiles(businessId: number, fileIds: number[]) {
  //   const spec: QuerySpec = {
  //     filter: { field: 'id', op: 'eq', value: businessId },
  //     extras: {
  //       include: {
  //         files: true,
  //       },
  //     },
  //   };
  //   const updateData = {
  //     files: {
  //       connect: fileIds.map((fileId) => ({ id: fileId })),
  //     },
  //   };
  //   return await this.model.updateOne(spec, updateData as any);
  // }

  // async fileExistsInBusinessImages(businessId: number, fileId: number) {
  //   const spec: QuerySpec = {
  //     filter: { field: 'id', op: 'eq', value: businessId },
  //     extras: {
  //       select: {
  //         files: {
  //           where: {
  //             id: fileId,
  //           },
  //         },
  //       },
  //     },
  //   };
  //   const business = await this.model.findOne(spec);
  //   return business?.files.length > 0;
  // }
}
