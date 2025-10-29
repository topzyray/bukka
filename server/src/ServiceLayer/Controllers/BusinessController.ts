import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  ParseIntPipe,
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
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { BusinessRepository } from 'src/BussinessLayer/BusinessRepository';
import {
  CreateBusinessDto,
  UpdateBusinessDto,
  FilterBusinessDto,
} from 'src/DomainLayer/Dtos/BusinessDto';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/businesses`)
@ApiTags('Business')
export class BusinessController {
  constructor(private readonly businessRepository: BusinessRepository) {}

  @Post()
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new business' })
  @ApiBody({ type: CreateBusinessDto })
  async createBusiness(@Body() dto: CreateBusinessDto, @Res() res: Response) {
    const response = await this.businessRepository.createBusiness(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get(':businessId')
  @ApiOperation({ summary: 'Get a business by ID' })
  @ApiParam({ name: 'businessId', example: 1 })
  async getBusinessById(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Res() res: Response,
  ) {
    const response = await this.businessRepository.getBusinessById(businessId);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get('my-businesses')
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all businesses for logged-in vendor' })
  async getMyBusinesses(@Res() res: Response) {
    const response = await this.businessRepository.getBusinessesByOwner();
    const data = BukkaResponse.GetSingleDataResponse(
      'Vendor Businesses',
      response,
    );
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get()
  @ApiOperation({ summary: 'Get all businesses with filters' })
  async getBusinesses(
    @Query() filters: FilterBusinessDto,
    @Res() res: Response,
  ) {
    const response = await this.businessRepository.getBusinesses(filters);
    const data = BukkaResponse.GetPagedDataResponse('Businesses', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Put(':businessId')
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a business by ID' })
  @ApiParam({ name: 'businessId', example: 1 })
  @ApiBody({ type: UpdateBusinessDto })
  async updateBusiness(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Body() dto: UpdateBusinessDto,
    @Res() res: Response,
  ) {
    const response = await this.businessRepository.updateBusiness(
      businessId,
      dto,
    );
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete(':businessId')
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a business by ID' })
  @ApiParam({ name: 'businessId', example: 1 })
  async deleteBusiness(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Res() res: Response,
  ) {
    const response = await this.businessRepository.deleteBusiness(businessId);
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
