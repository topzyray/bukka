import { Injectable, BadRequestException } from '@nestjs/common';
import { FavoriteDataAgent } from 'src/DataLayer/DataAgents/FavoriteDataAgent';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import {
  CreateFavoriteDto,
  FavoriteFilterDto,
} from 'src/DomainLayer/Dtos/FavoriteDto';
import {
  handleCache,
  invalidateCache,
} from 'src/InfrastructureLayer/Services/cache/CacheUtils';
import { CacheTTLPolicyEnum } from 'src/DomainLayer/Enums/CacheTTLPolicyEnum';

@Injectable()
export class FavoriteRepository {
  constructor(private readonly favoriteDataAgent: FavoriteDataAgent) {}

  async toggleFavorite(dto: CreateFavoriteDto) {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const existing = await this.favoriteDataAgent.findByUserAndBusiness(
      loggedInUser.id,
      dto.businessId,
    );
    if (existing) {
      await this.favoriteDataAgent.deleteFavorite(existing.id as number);
      await invalidateCache('user:favorites', { id: loggedInUser.id });
      return BukkaResponse.DeleteResponse('Favorite', true);
    }
    const created = await this.favoriteDataAgent.createFavorite({
      userId: loggedInUser.id,
      businessId: dto.businessId,
    } as any);
    await invalidateCache('user:favorites', { id: loggedInUser.id });
    return BukkaResponse.CreateResponse('Favorite', created);
  }

  async addFavorite(dto: CreateFavoriteDto) {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const existing = await this.favoriteDataAgent.findByUserAndBusiness(
      loggedInUser.id,
      dto.businessId,
    );
    if (existing) throw new BadRequestException('Business already favorited');

    const created = await this.favoriteDataAgent.createFavorite({
      userId: loggedInUser.id,
      businessId: dto.businessId,
    } as any);

    return BukkaResponse.CreateResponse('Favorite', created);
  }

  async removeFavoriteByBusiness(businessId: number) {
    const loggedInUser = await UserHelper.getLoggedInUser();
    const existing = await this.favoriteDataAgent.findByUserAndBusiness(
      loggedInUser.id,
      businessId,
    );
    if (!existing) return BukkaResponse.DeleteResponse('Favorite', true); // idempotent

    await this.favoriteDataAgent.deleteFavorite(existing.id as number);
    return BukkaResponse.DeleteResponse('Favorite', true);
  }

  async getLoggedInUserFavorites(filterDto: FavoriteFilterDto) {
    const loggedInUser = await UserHelper.getLoggedInUser();
    return handleCache(
      'user:favorites',
      { id: loggedInUser?.id },
      () => {
        const { pageSize, pageNumber } =
          FilterQueryHelper.extractPagination(filterDto);
        return this.favoriteDataAgent.getUserFavorites(
          loggedInUser.id,
          pageSize,
          pageNumber,
        );
      },
      CacheTTLPolicyEnum.USER_FAVORITE,
    );
  }
}
