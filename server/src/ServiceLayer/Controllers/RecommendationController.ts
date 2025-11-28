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
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { RecommendationRepository } from 'src/BussinessLayer/RecommendationRepository';
import {
  CreateRecommendationDto,
  FilterRecommendationDto,
} from 'src/DomainLayer/Dtos/RecommendationDto';
import { AdminAuthGuard } from 'src/MiddlewareLayer/Guards/AdminAuthGuard';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/recommendations`)
@ApiTags('Recommendations')
export class RecommendationController {
  constructor(private readonly businessRepository: RecommendationRepository) {}

  @Post()
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new recommenation' })
  @ApiBody({ type: CreateRecommendationDto })
  async createRecommendation(
    @Body() dto: CreateRecommendationDto,
    @Res() res: Response,
  ) {
    const response = await this.businessRepository.createRecommendation(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get(':recommendationId')
  @ApiOperation({ summary: 'Get a recommendation by ID' })
  @ApiParam({ name: 'recommendationId', example: 1 })
  async getRecommendationById(
    @Param('recommendationId', ParseIntPipe) recommendationId: number,
    @Res() res: Response,
  ) {
    const response =
      await this.businessRepository.getRecommendationById(recommendationId);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get('my-recommendations')
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all businesses for logged-in vendor' })
  async getMyBusinesses(@Res() res: Response) {
    const response = await this.businessRepository.getUserRecommendations();
    const data = BukkaResponse.GetSingleDataResponse(
      'Vendor Businesses',
      response,
    );
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get()
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Get all recommendations with filters' })
  async getRecommendations(
    @Query() filters: FilterRecommendationDto,
    @Res() res: Response,
  ) {
    const response = await this.businessRepository.getRecommendations(filters);
    const data = BukkaResponse.GetPagedDataResponse(
      'Recommendations',
      response,
    );
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Put(':recommendationId/approve')
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Approve a recommendation' })
  @ApiParam({ name: 'recommendationId', example: 1 })
  async approveRecommendation(
    @Param('recommendationId', ParseIntPipe) recommendationId: number,
    @Res() res: Response,
  ) {
    const response =
      await this.businessRepository.approveRecommendation(recommendationId);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Put(':recommendationId/reject')
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @ApiOperation({ summary: 'Reject a recommendation' })
  @ApiParam({ name: 'recommendationId', example: 1 })
  async rejectRecommendation(
    @Param('recommendationId', ParseIntPipe) recommendationId: number,
    @Res() res: Response,
  ) {
    const response =
      await this.businessRepository.rejectRecommendation(recommendationId);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete(':recommendationId')
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a recommendation by ID' })
  @ApiParam({ name: 'recommendationId', example: 1 })
  async deleteRecommendation(
    @Param('recommendationId', ParseIntPipe) recommendationId: number,
    @Res() res: Response,
  ) {
    const response =
      await this.businessRepository.deleteRecommendation(recommendationId);
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
