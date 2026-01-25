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
  CreateReviewDto,
  UpdateReviewDto,
  ReviewFilterDto,
} from 'src/DomainLayer/Dtos/ReviewDto';
import { ReviewRepository } from 'src/BusinessLayer/ReviewRepository';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/reviews`)
@ApiTags('Reviews')
export class ReviewController {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  @Post()
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiBody({ type: CreateReviewDto })
  async createReview(@Body() dto: CreateReviewDto, @Res() res: Response) {
    const response = await this.reviewRepository.createReview(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get()
  @ApiOperation({ summary: 'Get reviews for a business' })
  async getReviewsByFilters(
    @Query() filters: ReviewFilterDto,
    @Res() res: Response,
  ) {
    const response = await this.reviewRepository.getReviewsByFilters(filters);
    const data = BukkaResponse.GetPagedDataResponse(
      'Business revieww',
      response,
    );
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Get(':reviewId')
  @ApiOperation({ summary: 'Get review by ID' })
  @ApiParam({ name: 'reviewId', example: 1 })
  async getReviewById(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Res() res: Response,
  ) {
    const response = await this.reviewRepository.getReviewById(reviewId);
    const data = BukkaResponse.GetSingleDataResponse('Review', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Put()
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a review' })
  @ApiBody({ type: UpdateReviewDto })
  async updateReview(@Body() dto: UpdateReviewDto, @Res() res: Response) {
    const response = await this.reviewRepository.updateReview(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete(':reviewId')
  @ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
  @ApiSecurity('device-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a review' })
  @ApiParam({ name: 'reviewId', example: 1 })
  async deleteReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Res() res: Response,
  ) {
    const response = await this.reviewRepository.deleteReview(reviewId);
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
