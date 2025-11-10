import { Inject, Injectable } from '@nestjs/common';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { File } from 'src/DomainLayer/Models/File';
import { DatabaseConstant } from 'src/DomainLayer/Constants/DatabaseConstant';
import type {
  IDatabaseAdapter,
  ModelProxy,
  QuerySpec,
} from '../Adapters/DatabaseAdapter';
import { FileCategoryEnum } from 'src/DomainLayer/Enums/FileCategoryEnum';
import { FileReferenceTypeEnum } from 'src/DomainLayer/Enums/FileReferenceTypeEnum';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';

@Injectable()
export class FileDataAgent {
  private readonly model: ModelProxy<File>;

  constructor(
    @Inject(DatabaseConstant.DATABASE_ADAPTER)
    private readonly db: IDatabaseAdapter,
  ) {
    this.model = this.db.getModel<File>('file');
  }

  async createFile(data: Partial<File>): Promise<File> {
    return await this.model.insert(data);
  }

  async getFileById(fileId: number): Promise<File | null> {
    const querySpec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: fileId },
    };
    return await this.model.findOne(querySpec);
  }

  async getFileByIds(fileIds: number[]): Promise<File[]> {
    const querySpec: QuerySpec = {
      filter: { field: 'id', op: 'in', value: fileIds },
    };
    return await this.model.find(querySpec);
  }

  async getFileByReferenceId(referenceId: number): Promise<File[]> {
    const querySpec: QuerySpec = {
      filter: { field: 'referenceId', op: 'eq', value: referenceId },
    };
    return await this.model.find(querySpec);
  }

  async getFileByFilter(
    filter: any,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<File[]>> {
    const pageData = new PagedData<File[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;
    const spec: QuerySpec = {
      filter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
    };
    const total = await this.model.count({ filter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);
    const data = await this.model.find(spec);
    pageData.data = data;
    return pageData;
  }

  async findOneByCategoryAndReference(
    referenceId: number,
    category: FileCategoryEnum,
    referenceType: FileReferenceTypeEnum,
  ): Promise<File | null> {
    const querySpec: QuerySpec = {
      filter: {
        AND: [
          { field: 'referenceId', op: 'eq', value: referenceId },
          { field: 'category', op: 'eq', value: category },
          { field: 'referenceType', op: 'eq', value: referenceType },
        ],
      },
    };
    return await this.model.findOne(querySpec);
  }

  // async deleteFile(fileId: number): Promise<void> {
  //   const querySpec: QuerySpec = {
  //     filter: { field: 'id', op: 'eq', value: fileId },
  //   };
  //   return await this.model.deleteOne(querySpec);
  // }

  async deleteFile(fileId: number): Promise<void> {
    const querySpec: QuerySpec = {
      filter: { field: 'id', op: 'eq', value: fileId },
    };
    if (this.db.transaction) {
      return this.db.transaction(async (tx) => {
        const file = tx.getModel<File>('file');
        return await file.deleteOne(querySpec);
      });
    } else {
      return await this.model.deleteOne(querySpec);
    }
  }

  async deleteAllUserFiles(userId: number): Promise<{ count: number }> {
    const querySpec: QuerySpec = {
      filter: { field: 'createdById', op: 'eq', value: userId },
    };
    return await this.model.deleteMany(querySpec);
  }

  async getFilesByReferenceTypeAndId(
    referenceType: FileReferenceTypeEnum,
    referenceId: number,
  ): Promise<File[]> {
    const querySpec: QuerySpec = {
      filter: {
        AND: [
          { field: 'referenceId', op: 'eq', value: referenceId },
          { field: 'referenceType', op: 'eq', value: referenceType },
        ],
      },
    };
    return await this.model.find(querySpec);
  }

  async getFilesByCategory(
    category: FileCategoryEnum,
    pageSize: number,
    pageNumber: number,
  ): Promise<PagedData<File[]>> {
    const pageData = new PagedData<File[]>();
    pageData.page = pageNumber;
    pageData.pageSize = pageSize;
    const filter = FilterQueryHelper.buildQuery({
      dto: { category },
      rules: [{ field: 'category' }],
    });
    const spec: QuerySpec = {
      filter,
      sort: [{ field: 'createdAt', direction: 'desc' }],
      pagination: { page: pageNumber, pageSize },
    };
    const total = await this.model.count({ filter });
    pageData.total = total;
    pageData.pageCount = Math.ceil(total / pageSize);
    const data = await this.model.find(spec);
    pageData.data = data;
    return pageData;
  }
}
