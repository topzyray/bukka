import {
  Controller,
  Post,
  Param,
  Body,
  Res,
  Get,
  Query,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { SupportRepository } from 'src/BussinessLayer/SupportRepository';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import {
  CreateSupportDto,
  SupportFilterDto,
} from 'src/DomainLayer/Dtos/SupportDto';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/supports`)
@ApiTags('Support API')
@ApiBearerAuth()
export class SupportController {
  constructor(private readonly _supportRepo: SupportRepository) {}

  @Post()
  @ApiOperation({ summary: 'Create new Ticket' })
  async createSupport(@Body() dto: CreateSupportDto, @Res() res: Response) {
    const response = await this._supportRepo.createSupportAsync(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  // @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  // @ApiSecurity('device-id')
  // @UseGuards(JwtAuthGuard)
  // @Get(':supportId')
  // @ApiOperation({ summary: 'Get a support by ID' })
  // @ApiParam({
  //   name: 'supportId',
  //   description: 'The ID of the support',
  //   example: 1,
  // })
  // async getSupportById(
  //   @Param('supportId') supportId: number,
  //   @Res() res: Response,
  // ) {
  //   const response = await this._supportRepo.getSupportById(Number(supportId));
  //   const data = BukkaResponse.GetSingleDataResponse('Support', response);
  //   return BukkaResponse.GetStatusResponse(data, res);
  // }

  @Get()
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get supports by filters' })
  async getReviewByFilters(
    @Query() filters: SupportFilterDto,
    @Res() res: Response,
  ) {
    const response = await this._supportRepo.getSupportByFilter(filters);
    const data = BukkaResponse.GetPagedDataResponse('Reviews found', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Get(':ticketId')
  @ApiOperation({ summary: 'Get a support by Ticket ID' })
  @ApiParam({
    name: 'ticketId',
    description: 'The Ticket ID of the support',
    example: 'BUKKA-1741470230523-6789',
  })
  async getSupportByTicketId(
    @Param('ticketId') ticketId: string,
    @Res() res: Response,
  ) {
    const response = await this._supportRepo.getSupportByTicketId(ticketId);
    const data = BukkaResponse.GetSingleDataResponse('Support', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @Delete(':supportId')
  @ApiParam({
    name: 'supportId',
    example: 1,
    description: 'ID of the support',
  })
  async deleteSupport(
    @Param('supportId', ParseIntPipe) supportId: number,
    @Res() res: Response,
  ) {
    const response = await this._supportRepo.deleteSupport(Number(supportId));
    return res.status(response.responseCode).json(response);
  }
}
