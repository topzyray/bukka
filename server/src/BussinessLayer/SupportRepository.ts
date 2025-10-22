import { HttpStatus, Injectable } from '@nestjs/common';
import { Support } from '@prisma/client';
import { SupportDataAgent } from 'src/DataLayer/DataAgents/SupportDataAgent';
import {
  CreateSupportDto,
  SupportFilterDto,
} from 'src/DomainLayer/Dtos/SupportDto';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import { TextHelper } from 'src/InfrastructureLayer/Helpers/TextHelper';

@Injectable()
export class SupportRepository {
  constructor(private readonly _supportDataAgent: SupportDataAgent) {}

  async createSupportAsync(
    createSupportDto: CreateSupportDto,
  ): Promise<BukkaResponse<Support>> {
    let ticketId = TextHelper.generateTicketId();

    const existingTicketId = await this.getSupportByTicketId(ticketId);

    if (existingTicketId) {
      ticketId = TextHelper.generateTicketId();
    }

    const newSupport = {
      ...createSupportDto,
      ticketId,
    };
    const support = await this._supportDataAgent.createSupportAsync(newSupport);

    if (!support) {
      return BukkaResponse.ErrorResponse('Support', HttpStatus.NOT_IMPLEMENTED);
    }

    return BukkaResponse.CustomResponse(
      'Thank you for contacting us at Bukka. We will get back to you soon.',
      HttpStatus.CREATED,
      true,
      support,
    );
  }

  async getSupportById(supportId: number): Promise<Support | null> {
    const support = await this._supportDataAgent.getSupportById(supportId);
    return support;
  }

  async getSupportByTicketId(ticketId: string): Promise<Support | null> {
    const support = await this._supportDataAgent.getSupportByTicketId(ticketId);
    return support;
  }

  async getSupportByFilter(
    filterDto: SupportFilterDto,
  ): Promise<PagedData<any[]>> {
    const query = FilterQueryHelper.buildQuery({
      dto: filterDto,
      rules: [
        { field: 'supportId' },
        { field: 'ticketId' },
        { field: 'search' },
      ],
      searchConfig: {
        fields: ['name', 'email', 'subject', 'message'],
        mode: 'insensitive',
      },
    });

    const { pageSize, pageNumber } =
      FilterQueryHelper.extractPagination(filterDto);

    return await this._supportDataAgent.getSupportByFilter(
      query,
      pageSize,
      pageNumber,
    );
  }

  async deleteSupport(supportId: number): Promise<BukkaResponse<void>> {
    const existingSupport =
      await this._supportDataAgent.getSupportById(supportId);
    if (!existingSupport) {
      return BukkaResponse.ErrorResponse(
        'Support not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this._supportDataAgent.deleteSupport(supportId);
    return BukkaResponse.DeleteResponse(
      'Support',
      true,
      'Support deleted successfully',
      null,
    );
  }
}
