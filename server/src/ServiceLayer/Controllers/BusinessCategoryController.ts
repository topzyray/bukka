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
  ApiTags,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import {
  CreateBusinessCategoryDto,
  UpdateBusinessCategoryDto,
  FilterBusinessCategoryDto,
} from 'src/DomainLayer/Dtos/BusinessCategoryDto';
import { BusinessCategoryRepository } from 'src/BussinessLayer/BusinessCategoryRepository';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { AdminAuthGuard } from 'src/MiddlewareLayer/Guards/AdminAuthGuard';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/business-categories`)
@ApiTags('Business Category')
export class BusinessCategoryController {
  constructor(
    private readonly categoryRepository: BusinessCategoryRepository,
  ) {}

  @Post()
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Create a business category' })
  @ApiBody({ type: CreateBusinessCategoryDto })
  async createCategory(
    @Body() dto: CreateBusinessCategoryDto,
    @Res() res: Response,
  ) {
    const response = await this.categoryRepository.createCategory(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get()
  @ApiOperation({ summary: 'List business categories' })
  async listCategories(
    @Query() filters: FilterBusinessCategoryDto,
    @Res() res: Response,
  ) {
    const response = await this.categoryRepository.list(filters);
    const data = BukkaResponse.GetPagedDataResponse(
      'Business categories',
      response,
    );
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Get(':categoryId')
  @ApiOperation({ summary: 'Get business category by ID' })
  @ApiParam({ name: 'categoryId', example: 1 })
  async getCategoryById(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Res() res: Response,
  ) {
    const response = await this.categoryRepository.getById(categoryId);
    const data = BukkaResponse.GetSingleDataResponse(
      'Business category',
      response,
    );
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Put(':categoryId')
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Update business category by ID' })
  @ApiParam({ name: 'categoryId', example: 1 })
  @ApiBody({ type: UpdateBusinessCategoryDto })
  async updateCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() dto: UpdateBusinessCategoryDto,
    @Res() res: Response,
  ) {
    const response = await this.categoryRepository.update(categoryId, dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete(':categoryId')
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Delete business category by ID' })
  @ApiParam({ name: 'categoryId', example: 1 })
  async deleteCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Res() res: Response,
  ) {
    const response = await this.categoryRepository.delete(categoryId);
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
