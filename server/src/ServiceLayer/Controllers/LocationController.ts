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
  CreateLocationDto,
  UpdateLocationDto,
  FilterLocationDto,
  SearchLocationDto,
} from 'src/DomainLayer/Dtos/LocationDto';
import { LocationRepository } from 'src/BussinessLayer/LocationRepository';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/locations`)
@ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
@ApiSecurity('device-id')
@UseGuards(JwtAuthGuard)
@ApiTags('Location')
export class LocationController {
  constructor(private readonly locationRepository: LocationRepository) {}

  @Post()
  @ApiOperation({ summary: 'Create location (from placeId or lat/lng)' })
  @ApiBody({ type: CreateLocationDto })
  async createLocation(@Body() dto: CreateLocationDto, @Res() res: Response) {
    const response = await this.locationRepository.createLocation(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated data for list of locations' })
  async listLocations(
    @Query() filters: FilterLocationDto,
    @Res() res: Response,
  ) {
    const response = await this.locationRepository.findLocations(filters);
    const data = BukkaResponse.GetPagedDataResponse('Locations', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search locations' })
  async searchLocation(
    @Query() searchFilters: SearchLocationDto,
    @Res() res: Response,
  ) {
    const response =
      await this.locationRepository.searchLocations(searchFilters);
    const data = BukkaResponse.GetPagedDataResponse('Locations', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Get(':locationId')
  @ApiOperation({ summary: 'Get a location by ID' })
  @ApiParam({ name: 'locationId', example: 1 })
  async getLocationById(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Res() res: Response,
  ) {
    const response = await this.locationRepository.findLocationById(locationId);
    const data = BukkaResponse.GetSingleDataResponse('Location', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Put(':locationId')
  @ApiOperation({ summary: 'Update a location by ID' })
  @ApiParam({ name: 'locationId', example: 1 })
  @ApiBody({ type: UpdateLocationDto })
  async updateLocation(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Body() dto: UpdateLocationDto,
    @Res() res: Response,
  ) {
    const response = await this.locationRepository.updateLocation(
      locationId,
      dto,
    );
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete(':locationId')
  @ApiOperation({ summary: 'Delete a location by ID' })
  @ApiParam({ name: 'locationId', example: 1 })
  async deleteLocation(
    @Param('locationId', ParseIntPipe) locationId: number,
    @Res() res: Response,
  ) {
    const response = await this.locationRepository.deleteLocation(locationId);
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
