import { Service } from 'src/DomainLayer/Models/Service';
import {
  handleCache,
  invalidateCache,
} from 'src/InfrastructureLayer/Services/cache/CacheUtils';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { Injectable, NotFoundException } from '@nestjs/common';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { CacheTTLPolicyEnum } from 'src/DomainLayer/Enums/CacheTTLPolicyEnum';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import { ServiceDataAgent } from 'src/DataLayer/DataAgents/ServiceDataAgent';
import {
  CreateServiceDto,
  ServiceFilterDto,
  UpdateServiceDto,
} from 'src/DomainLayer/Dtos/ServiceDto';

@Injectable()
export class ServiceRepository {
  constructor(private readonly serviceDataAgent: ServiceDataAgent) {}

  async createService(dto: CreateServiceDto): Promise<BukkaResponse<Service>> {
    const service = await this.serviceDataAgent.createService(dto);
    await invalidateCache('services', {});
    await invalidateCache('services', { businessId: dto.businessId });
    return BukkaResponse.CreateResponse('Service', service);
  }

  async getServiceById(id: number): Promise<BukkaResponse<Service>> {
    return handleCache(
      'service',
      { id },
      async () => {
        const service = await this.serviceDataAgent.findById(id);
        if (!service) throw new NotFoundException('Service not found');
        return BukkaResponse.GetSingleDataResponse('Service', service);
      },
      CacheTTLPolicyEnum.SERVICE_DETAILS,
    );
  }

  async getServicesByFilters(
    filter: ServiceFilterDto,
  ): Promise<PagedData<Service[]>> {
    return handleCache(
      'services',
      filter as Record<string, any>,
      () => {
        const query = FilterQueryHelper.buildQuery({
          dto: filter,
          rules: [{ field: 'businessId' }, { field: 'isActive' }],
        });
        const { pageSize, pageNumber } =
          FilterQueryHelper.extractPagination(filter);
        return this.serviceDataAgent.findByFilters(query, pageSize, pageNumber);
      },
      CacheTTLPolicyEnum.SERVICES,
    );
  }

  async updateService(dto: UpdateServiceDto) {
    const service = await this.serviceDataAgent.findById(dto.serviceId);
    if (!service) throw new NotFoundException('Service not found');
    const updated = await this.serviceDataAgent.updateService(
      dto.serviceId,
      dto,
    );
    await invalidateCache('services', {});
    await invalidateCache('services', { businessId: service.businessId });
    await invalidateCache('service', { id: service.id });
    return BukkaResponse.UpdateResponse('Service', updated);
  }

  async deleteService(id: number) {
    const service = await this.serviceDataAgent.findById(id);
    if (!service) throw new NotFoundException('Service not found');
    await this.serviceDataAgent.deleteService(id);
    await invalidateCache('services', {});
    await invalidateCache('services', { businessId: service.businessId });
    await invalidateCache('service', { id: service.id });
    return BukkaResponse.DeleteResponse('Service', true);
  }
}
