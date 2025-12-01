import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SupportDataAgent } from 'src/DataLayer/DataAgents/SupportDataAgent';
import {
  AssignSupportDto,
  CreateSupportDto,
  ResolveSupportDto,
  SupportFilterDto,
} from 'src/DomainLayer/Dtos/SupportDto';
import { QueueEnum } from 'src/DomainLayer/Enums/Queue/QueueEnum';
import { SupportQueueMessageTypeEnum } from 'src/DomainLayer/Enums/Queue/SupportQueueMessageTypeEnum copy';
import { QueueProviderEnum } from 'src/DomainLayer/Enums/QueueProviderEnum';
import { SupportStatusEnum } from 'src/DomainLayer/Enums/SupportStatusEnum';
import { UserRoleEnum } from 'src/DomainLayer/Enums/UserRoleEnum';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { PagedData } from 'src/DomainLayer/Models/PagedData';
import { Support } from 'src/DomainLayer/Models/Support';
import { FilterQueryHelper } from 'src/InfrastructureLayer/Helpers/FilterQueryHelper';
import { TextHelper } from 'src/InfrastructureLayer/Helpers/TextHelper';
import { UserHelper } from 'src/InfrastructureLayer/Helpers/UserHelper';
import { QueueService } from 'src/InfrastructureLayer/Services/queue/QueueService';

@Injectable()
export class SupportRepository {
  constructor(
    private readonly _supportDataAgent: SupportDataAgent,
    private readonly _queue: QueueService,
  ) {}

  async createSupportAsync(
    createSupportDto: CreateSupportDto,
  ): Promise<BukkaResponse<Support>> {
    const loggedInUser = await UserHelper.getLoggedInUser();

    let ticketId = TextHelper.generateTicketId();

    const existingTicketId = await this.getSupportByTicketId(ticketId);

    if (existingTicketId) {
      ticketId = TextHelper.generateTicketId();
    }

    const newSupport = {
      ...createSupportDto,
      ticketId,
      creatorId: createSupportDto?.email ?? null,
      creatorEmail: createSupportDto?.email ?? null,
    };
    const support = await this._supportDataAgent.createSupportAsync(newSupport);

    if (!support) {
      return BukkaResponse.ErrorResponse('Support', HttpStatus.NOT_IMPLEMENTED);
    }

    this._queue.publishToQueue(
      QueueEnum.SUPPORT_NOTIFICATION,
      {
        messageType: SupportQueueMessageTypeEnum.SUPPORT_TICKET_CREATED,
        payload: {
          creatorId: loggedInUser?.id,
          creatorEmail: loggedInUser?.email,
          firstName: loggedInUser?.firstName,
          lastName: loggedInUser?.lastName,
          ticketId: support?.ticketId,
          subject: support?.subject,
          message: support?.message,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

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
  ): Promise<PagedData<Support[]>> {
    const loggedInUser = await UserHelper.getLoggedInUser();

    const baseFilters = { ...filterDto };

    if (loggedInUser?.role !== UserRoleEnum.ADMIN) {
      baseFilters.email = loggedInUser?.email;
    }

    const query = FilterQueryHelper.buildQuery({
      dto: baseFilters,
      rules: [{ field: 'ticketId' }, { field: 'email' }, { field: 'status' }],
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

  async assignSupportTicket(dto: AssignSupportDto) {
    const { supportId: id, assigneeId } = dto;
    const existing = await this._supportDataAgent.getSupportById(id);
    if (!existing) throw new NotFoundException('Support ticket not found');
    const updated = await this._supportDataAgent.updateSupport(id, {
      assigneeId,
      status: SupportStatusEnum.PENDING,
    });

    this._queue.publishToQueue(
      QueueEnum.SUPPORT_NOTIFICATION,
      {
        messageType: SupportQueueMessageTypeEnum.SUPPORT_TICKET_ASSIGNED,
        payload: {
          creatorId: updated?.creatorId,
          creatorEmail: updated?.creatorEmail,
          assigneeFirstName: updated?.assignee?.firstName,
          assigneeLastName: updated?.assignee?.lastName,
          ticketId: updated?.ticketId,
          subject: updated?.subject,
          message: updated?.message,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

    return BukkaResponse.CustomResponse(
      'Ticket assigned successfully',
      HttpStatus.OK,
      true,
      updated,
    );
  }

  async resolveSupportTicket(dto: ResolveSupportDto) {
    const existing = await this._supportDataAgent.getSupportById(dto.supportId);
    if (!existing) throw new NotFoundException('Support ticket not found');
    const resolvedAt = new Date();
    const updated = await this._supportDataAgent.updateSupport(dto.supportId, {
      resolvedAt,
      status: SupportStatusEnum.RESOLVED,
    });

    this._queue.publishToQueue(
      QueueEnum.SUPPORT_NOTIFICATION,
      {
        messageType: SupportQueueMessageTypeEnum.SUPPORT_TICKET_RESOLVED,
        payload: {
          creatorId: updated?.creatorId,
          creatorEmail: updated?.creatorEmail,
          ticketId: updated?.ticketId,
        },
      },
      {
        provider: QueueProviderEnum.BULLMQ,
      },
    );

    return BukkaResponse.CustomResponse(
      'Ticket resolved successfully',
      HttpStatus.OK,
      true,
      updated,
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
