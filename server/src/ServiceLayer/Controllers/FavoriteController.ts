import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { FavoriteRepository } from 'src/BussinessLayer/FavoriteRepository';
import {
  CreateFavoriteDto,
  FavoriteFilterDto,
} from 'src/DomainLayer/Dtos/FavoriteDto';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/favorites`)
@ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
@ApiSecurity('device-id')
@UseGuards(JwtAuthGuard)
@ApiTags('Favorites')
export class FavoriteController {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  @Put()
  @ApiOperation({ summary: 'Add or remove restaurant to favorite' })
  @ApiBody({ type: CreateFavoriteDto })
  async addFavorite(@Body() dto: CreateFavoriteDto, @Res() res: Response) {
    const response = await this.favoriteRepository.toggleFavorite(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get('my-favorites')
  @ApiOperation({ summary: 'Get loggedin user favorites by filters' })
  async getLoggedInUserFavorites(
    @Query() filters: FavoriteFilterDto,
    @Res() res: Response,
  ) {
    const response =
      await this.favoriteRepository.getLoggedInUserFavorites(filters);
    const data = BukkaResponse.GetPagedDataResponse(
      'User favorites found',
      response,
    );
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Delete(':businessId')
  @ApiOperation({ summary: 'Remove from favorite' })
  @ApiParam({ name: 'businessId', example: 1 })
  async removeFavoriteByBusiness(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Res() res: Response,
  ) {
    const response =
      await this.favoriteRepository.removeFavoriteByBusiness(businessId);
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
