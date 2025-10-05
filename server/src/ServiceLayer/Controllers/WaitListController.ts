import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from 'src/DomainLayer/Decorators/PublicDecorator';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { WaitlistRepository } from 'src/BussinessLayer/WaitlistRepository';
import {
  CreateWaitlistDto,
  WaitlistFilterDto,
} from 'src/DomainLayer/Dtos/WaitlistDto';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/waitlist`)
@ApiTags('Waitlist API')
@ApiBearerAuth()
export class WaitListController {
  constructor(private readonly _waitlistRepository: WaitlistRepository) {}

  @Public()
  @Post('join')
  @ApiOperation({ summary: 'Add user to waitlist.' })
  @ApiBody({ type: CreateWaitlistDto })
  async signUp(@Body() request: CreateWaitlistDto, @Res() res: Response) {
    const response = await this._waitlistRepository.createWaitlist(request);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get()
  @ApiOperation({ summary: 'Get all paginated waitlist' })
  async getNotificationSettingsByFilters(
    @Query() request: WaitlistFilterDto,
    @Res() res: Response,
  ) {
    const response = await this._waitlistRepository.findByFilters(request);
    const data = BukkaResponse.GetPagedDataResponse('Waitlist', response);
    return res.status(data.responseCode).json(data);
  }

  @Get('count')
  @ApiOperation({ summary: 'Get total waitlist count' })
  async getTotalWaitlistCount(@Res() res: Response) {
    const response = await this._waitlistRepository.getTotalWaitlistCount();
    return res.status(response.responseCode).json(response);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a waitlist by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the waitlist',
    example: 1,
  })
  async getUserById(@Param('id') id: number, @Res() res: Response) {
    const response = await this._waitlistRepository.getWaitlistById(Number(id));
    const data = BukkaResponse.GetSingleDataResponse('Waitlist', response);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a waitlist by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the waitlist',
    example: 12,
  })
  async deleteUserAccount(@Param('id') id: number, @Res() res: Response) {
    const result = await this._waitlistRepository.deleteWaitlist(id);
    return res.status(result.responseCode).json(result);
  }
}
