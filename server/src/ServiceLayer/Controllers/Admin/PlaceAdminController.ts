import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { AdminAuthGuard } from '../../../MiddlewareLayer/Guards/AdminAuthGuard';
import { AdminApiRoutesConstant } from 'src/DomainLayer/Constants/AdminApiRoutesConstant';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { PlaceImportService } from 'src/InfrastructureLayer/Services/place/PlaceImportService';
import {
  AdminPlaceImportDto,
  AdminPlaceSearchDto,
} from 'src/DomainLayer/Dtos/Admin/AdminPlaceDto';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { BusinessRepository } from 'src/BusinessLayer/BusinessRepository';
import { CreateBusinessDto } from 'src/DomainLayer/Dtos/BusinessDto';

@Controller(`${AdminApiRoutesConstant.BASE_URL}/places`)
@ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
@ApiSecurity('device-id')
@UseGuards(JwtAuthGuard, AdminAuthGuard)
@ApiTags('Admin Places')
export class PlaceAdminController {
  constructor(
    private readonly placeImportService: PlaceImportService,
    private readonly businessRepository: BusinessRepository,
  ) {}

  @Post('import-one')
  @ApiOperation({ summary: 'Import a business from 3rd party map' })
  @ApiBody({ type: CreateBusinessDto })
  async importBusiness(@Body() dto: CreateBusinessDto, @Res() res: Response) {
    const response = await this.businessRepository.importBusiness(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Post('import-many')
  @ApiOperation({ summary: 'Import place' })
  async import(
    @Body() adminPlaceDto: AdminPlaceImportDto,
    @Res() res: Response,
  ) {
    const result = await this.placeImportService.importSingle(adminPlaceDto);
    const data = BukkaResponse.CustomResponse(
      'Place imported and business created successfully!',
      HttpStatus.OK,
      true,
      result,
    );
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search places' })
  async search(@Query() q: AdminPlaceSearchDto, @Res() res: Response) {
    const results = await this.placeImportService.search(q.provider, {
      query: q.query ?? '',
      category: q.category,
      lat: q.lat,
      lng: q.lng,
      radius: q.radius,
      limit: q.limit,
    });
    const data = BukkaResponse.CustomResponse(
      'Places',
      HttpStatus.OK,
      true,
      results,
    );
    return BukkaResponse.GetStatusResponse(data, res);
  }
}
