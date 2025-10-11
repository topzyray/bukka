import type { Response } from 'express';
import {
  Controller,
  Get,
  Delete,
  Param,
  Body,
  Res,
  Query,
  Put,
  UseGuards,
  Post,
} from '@nestjs/common';
import {
  NotificationSettingsFilterDto,
  UpdateNotificationSettingsDto,
} from 'src/DomainLayer/Dtos/NotificationSettingsDto';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { NotificationSettingsRepository } from 'src/BussinessLayer/NotificationSettingsRepository';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';
import { UserPersonalizationRepository } from 'src/BussinessLayer/UserPersonalizationRepository';
import {
  CreateUserPersonalizationDto,
  UpdateUserPersonalizationDto,
} from 'src/DomainLayer/Dtos/UserPersonalizationDto';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/users/personalization`)
@ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
@UseGuards(JwtAuthGuard)
@ApiTags('User Personalization')
export class UserPersonalizationController {
  constructor(
    private readonly userPersonalizationRepository: UserPersonalizationRepository,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create user personalization' })
  @ApiBody({ type: CreateUserPersonalizationDto })
  async signUp(
    @Body() request: CreateUserPersonalizationDto,
    @Res() res: Response,
  ) {
    const response =
      await this.userPersonalizationRepository.createUserPersonalization(
        request,
      );
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get()
  @ApiOperation({ summary: 'Get logged in user personalizations' })
  async getLoggedInUserPersonalization(@Res() res: Response) {
    const response =
      await this.userPersonalizationRepository.getLoggedInUserPersonalization();
    return BukkaResponse.GetStatusResponse(response, res);
  }

  // @Get()
  // @ApiOperation({ summary: 'Get all paginated user notifications settings' })
  // async getNotificationSettingsByFilters(
  //   @Query() request: NotificationSettingsFilterDto,
  //   @Res() res: Response,
  // ) {
  //   const response =
  //     await this.userPersonalizationRepository.findNotificationSettingByFilters(
  //       request,
  //     );
  //   const data = BukkaResponse.GetPagedDataResponse(
  //     'notification settings',
  //     response,
  //   );
  //   return res.status(data.responseCode).json(data);
  // }

  @Put()
  @ApiOperation({ summary: 'Update user notifications settings' })
  @ApiBody({ type: UpdateUserPersonalizationDto })
  async updateUserPersonalization(
    @Body() dto: UpdateUserPersonalizationDto,
    @Res() res: Response,
  ) {
    const response =
      await this.userPersonalizationRepository.updateUserPersonalization(dto);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete(':personalizationId')
  @ApiOperation({
    summary: 'Delete user personalization by ID',
  })
  async deleteUserPersonalization(
    @Param('personalizationId') personalizationId: number,
    @Res() res: Response,
  ): Promise<void> {
    const response =
      await this.userPersonalizationRepository.deleteUserPersonalization(
        personalizationId,
      );
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
