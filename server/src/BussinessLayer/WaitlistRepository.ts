import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { User } from 'src/DomainLayer/Models/User';
import { WaitlistDataAgent } from 'src/DataLayer/DataAgents/WaitlistDataAgent';
import {
  CreateWaitlistDto,
  WaitlistFilterDto,
} from 'src/DomainLayer/Dtos/WaitlistDto';
import { Waitlist } from 'src/DomainLayer/Models/Waitlist';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';

@Injectable()
export class WaitlistRepository {
  constructor(private readonly _waitlistDataAgent: WaitlistDataAgent) {}

  async createWaitlist(data: CreateWaitlistDto): Promise<BukkaResponse<User>> {
    const existingWaitlist =
      await this._waitlistDataAgent.getWaitlistByUserEmail(data.email);
    if (existingWaitlist) {
      throw new ConflictException(
        'You’re on the list! We’ll notify you when Bukka goes live!',
      );
    }
    const waitlist = data as Waitlist;
    const result = await this._waitlistDataAgent.createWaitlistAsync(waitlist);
    return BukkaResponse.customResponse(
      'You’re on the list! We’ll notify you when Bukka goes live!',
      HttpStatus.CREATED,
      true,
      result,
    );
  }

  async getWaitlistById(waitlistId: number) {
    return this._waitlistDataAgent.getWaitlistById(waitlistId);
  }

  async findWaitlistByUserEmail(email: string) {
    return this._waitlistDataAgent.getWaitlistByUserEmail(email);
  }

  async deleteWaitlist(waitlistId: number): Promise<BukkaResponse<void>> {
    const waitlist = await this.getWaitlistById(waitlistId);
    if (!waitlist) {
      throw new NotFoundException('Waitlist not found!');
    }

    await this._waitlistDataAgent.deleteWaitlist(waitlistId);
    return BukkaResponse.deleteResponse('Waitlist', true);
  }

  async findByFilters(filterDto: WaitlistFilterDto): Promise<PagedData<any[]>> {
    const query = FilterQueryHelper.buildQuery({
      dto: filterDto,
      rules: [{ field: 'email' }, { field: 'phoneNumber' }],
      searchConfig: {
        fields: ['name', 'email'],
        mode: 'insensitive',
      },
    });
    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(filterDto);
    return await this._waitlistDataAgent.getWaitlistByFilter(
      query,
      pageSize,
      pageNumber,
    );
  }
}
