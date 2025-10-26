import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BusinessCategoryDataAgent } from 'src/DataLayer/DataAgents/BusinessCategoryDataAgent';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import {
  CreateBusinessCategoryDto,
  UpdateBusinessCategoryDto,
  FilterBusinessCategoryDto,
} from 'src/DomainLayer/Dtos/BusinessCategoryDto';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import slugify from 'slugify';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';
import {
  handleCache,
  invalidateCache,
} from 'src/InfrastructureLayer/Services/cache/CacheUtils';
import { CacheTTLPolicy } from 'src/DomainLayer/Enums/CacheTTLPolicyEnum';

@Injectable()
export class BusinessCategoryRepository {
  constructor(private readonly dataAgent: BusinessCategoryDataAgent) {}

  async createCategory(dto: CreateBusinessCategoryDto) {
    const loggedInAdmin = await UserHelper.getLoggedInUser();
    const slug = slugify(dto.name, { lower: true, strict: true });
    const existing = await this.dataAgent.findBySlug(slug);
    if (existing)
      throw new BadRequestException('Category slug already exists.');
    const newCategory = {
      ...dto,
      slug,
      createdBy: loggedInAdmin.id,
    };
    const created = await this.dataAgent.createCategory(newCategory);
    await invalidateCache('categories', {});
    return BukkaResponse.CreateResponse('BusinessCategory', created);
  }

  async getById(id: number) {
    return handleCache(
      'category',
      { id },
      async () => {
        const cat = await this.dataAgent.findById(id);
        if (!cat) throw new NotFoundException('Category not found');
        return BukkaResponse.GetSingleDataResponse('BusinessCategory', cat);
      },
      CacheTTLPolicy.CATEGORY,
    );
  }

  async list(filterDto: FilterBusinessCategoryDto) {
    return handleCache(
      'categories',
      filterDto as Record<any, any>,
      () => {
        const query = FilterQueryHelper.buildQuery({
          dto: filterDto,
          rules: [{ field: 'createdBy' }, { field: 'type' }],
          searchConfig: {
            fields: ['name', 'description', 'slug'],
            mode: 'insensitive',
          },
        });
        const { pageSize, pageNumber } =
          FilterQueryHelper.extractPagination(filterDto);
        return this.dataAgent.findAll(query, pageSize, pageNumber);
      },
      CacheTTLPolicy.CATEGORY,
    );
  }

  async update(id: number, dto: UpdateBusinessCategoryDto) {
    const existing = await this.dataAgent.findById(id);
    if (!existing) throw new NotFoundException('Category not found');
    const updated = await this.dataAgent.updateCategory(id, dto as any);
    await invalidateCache('category', { id });
    await invalidateCache('categories', {});
    return BukkaResponse.UpdateResponse('BusinessCategory', updated);
  }

  async delete(id: number) {
    const existing = await this.dataAgent.findById(id);
    if (!existing) throw new NotFoundException('Category not found');
    await this.dataAgent.deleteCategory(id);
    await invalidateCache('category', { id });
    await invalidateCache('categories', {});
    return BukkaResponse.DeleteResponse('BusinessCategory', true);
  }
}
