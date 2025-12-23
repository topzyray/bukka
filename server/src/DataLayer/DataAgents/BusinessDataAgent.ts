import { Inject, Injectable } from '@nestjs/common';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import { Business } from 'src/DomainLayer/Models/Business';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { FilterBusinessBoundsDto } from 'src/DomainLayer/Dtos/BusinessDto';

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

  async findBusinessesWithBounds(
    filter: FilterBusinessBoundsDto,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<Business[]>> {
    const pageData = new PagedData<Business[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;

    const BUFFER = 0.005; // ~500m

    const north = Number(filter.north) + BUFFER;
    const south = Number(filter.south) - BUFFER;
    const east = Number(filter.east) + BUFFER;
    const west = Number(filter.west) - BUFFER;

    // Build a location constraint. We construct a Prisma-like object and
    // pass it through the ModelProxy (PrismaAdapterHelper will convert it).
    const latCondition = { latitude: { gte: south, lte: north } };
    let locationConstraint: any;

    if (west <= east) {
      // normal case
      locationConstraint = {
        location: {
          ...latCondition,
          longitude: { gte: west, lte: east },
        },
      };
    } else {
      // crosses the antimeridian: include longitudes >= west OR <= east
      locationConstraint = {
        OR: [
          {
            location: {
              ...latCondition,
              longitude: { gte: west, lte: 180 },
            },
          },
          {
            location: {
              ...latCondition,
              longitude: { gte: -180, lte: east },
            },
          },
        ],
      };
    }

    // Base filter: only active businesses by default (remove if not desired).
    // Put locationConstraint inside an AND so we can push additional optional filters easily.
    const baseFilter: any = {
      AND: [locationConstraint],
    };

    if (!filter.includeInactive) {
      baseFilter.isActive = true;
    }

    // Optional extra filters (only added when provided)
    if (filter.type !== undefined && filter.type !== null) {
      baseFilter.AND.push({ type: filter.type });
    }
    // if (filter.categoryId !== undefined && filter.categoryId !== null) {
    //   baseFilter.AND.push({ categoryId: Number(filter.categoryId) });
    // }

    // If there are no other AND items besides location, simplify the filter
    // (not strictly necessary, but keeps Prisma where objects tidy).
    if (baseFilter.AND.length === 1) {
      // replace AND array with the single constraint so PrismaAdapterHelper receives a plain object
      const single = baseFilter.AND[0];
      delete baseFilter.AND;
      Object.assign(baseFilter, single);
    }

    // Build QuerySpec (no ranking/sorting logic)
    const spec: QuerySpec = {
      filter: baseFilter,
      extras: {
        select: {
          id: true,
          name: true,
          type: true,
          averageRating: true,
          reviewCount: true,
          openingHours: true,
          cuisines: true,

          category: {
            select: {
              id: true,
              name: true,
              type: true,
              slug: true,
            },
          },
          location: {
            select: {
              id: true,
              placeId: true,
              longitude: true,
              latitude: true,
              address: true,
            },
          },
        },
      },
    };

    // Apply pagination only when requested (pageSize > 0)
    if (pageSize > 0) {
      spec.pagination = { page: pageNumber, pageSize };
    }

    // Use the same baseFilter for count() and find() to keep paging accurate.
    const total = await this.model.count({ filter: baseFilter });
    pageData.total = total;
    pageData.pageCount = pageSize > 0 ? Math.ceil(total / pageSize) : 1;

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
