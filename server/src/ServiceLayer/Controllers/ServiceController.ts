import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { ServiceRepository } from 'src/BusinessLayer/ServiceRepository';
import {
  CreateServiceDto,
  ServiceFilterDto,
  UpdateServiceDto,
} from 'src/DomainLayer/Dtos/ServiceDto';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/business/services`)
@ApiTags('Services')
export class ServiceController {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  @Post()
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new service' })
  @ApiBody({ type: CreateServiceDto })
  async createService(@Body() dto: CreateServiceDto, @Res() res: Response) {
    const response = await this.serviceRepository.createService(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get()
  async getServices(@Query() filter: ServiceFilterDto, @Res() res: Response) {
    const response = await this.serviceRepository.getServicesByFilters(filter);
    const data = BukkaResponse.GetPagedDataResponse('Services', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Get(':serviceId')
  async getServiceById(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Res() res: Response,
  ) {
    const response = await this.serviceRepository.getServiceById(serviceId);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Put()
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a new service' })
  @ApiBody({ type: UpdateServiceDto })
  async updateService(@Body() dto: UpdateServiceDto, @Res() res: Response) {
    const response = await this.serviceRepository.updateService(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete(':serviceId')
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a service by ID' })
  @ApiParam({ name: 'serviceId', example: 1 })
  async deleteService(
    @Param('serviceId', ParseIntPipe) serviceId: number,
    @Res() res: Response,
  ) {
    const response = await this.serviceRepository.deleteService(serviceId);
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
