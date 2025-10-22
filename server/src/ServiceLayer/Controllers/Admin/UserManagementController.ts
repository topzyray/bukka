import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import {
  AdminUpdateUserDto,
  AdminUserFilterDto,
  CreateAdminUserDto,
} from 'src/DomainLayer/Dtos/Admin/AdminUserDto';
import { AdminAuthGuard } from '../../../MiddlewareLayer/Guards/AdminAuthGuard';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { AdminApiRoutesConstant } from 'src/DomainLayer/Constants/AdminApiRoutesConstant';
import { UserRepository } from 'src/BussinessLayer/UserRepository';
import { EmailService } from 'src/InfrastructureLayer/Services/email/EmailService';
import { TypeSafeMapper } from 'src/MiddlewareLayer/Mappings/TypeSafeMapper';
import { User } from 'src/DomainLayer/Models/User';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';

@Controller(`${AdminApiRoutesConstant.BASE_URL}/users`)
@ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
@ApiSecurity('device-id')
@UseGuards(JwtAuthGuard, AdminAuthGuard)
@ApiTags('Admin User Management')
export class UserManagementController {
  constructor(
    private userRepository: UserRepository,
    private readonly notif: EmailService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create admin account.' })
  @ApiBody({ type: CreateAdminUserDto })
  async createAdminUser(
    @Body() request: CreateAdminUserDto,
    @Res() res: Response,
  ) {
    const response = await this.userRepository.createUserAsync(request);
    if (response.status) {
      await this.notif.sendMail(response.responseData);
      response.responseData = TypeSafeMapper.mapObject(response.responseData, {
        exclude: [
          'password',
          'confirmationCode',
          'confirmationCodeExpires',
          'passwordResetToken',
          'passwordResetExpires',
        ],
      });
    }
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get()
  @ApiOperation({ summary: 'Get users by filters' })
  async getUsersByFilters(
    @Query() filter: AdminUserFilterDto,
    @Res() res: Response,
  ) {
    const response = await this.userRepository.adminFindByFilters(filter);

    const mappedResponse = {
      ...response,
      data: TypeSafeMapper.mapArray(response?.data, {
        exclude: [
          'password',
          'confirmationCode',
          'confirmationCodeExpires',
          'passwordResetToken',
          'passwordResetExpires',
        ],
      }),
    };
    const data = BukkaResponse.GetPagedDataResponse('Users', mappedResponse);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get users stats' })
  async getUserSummary(@Res() res?: Response) {
    const response = await this.userRepository.getAdminOverview();
    const data = BukkaResponse.GetPagedDataResponse('Overview', response);
    return BukkaResponse.GetStatusResponse(data, res as any);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    example: 3,
  })
  async getUserById(@Param('userId') userId: number, @Res() res: Response) {
    const response = await this.userRepository.findUserById(Number(userId));
    const mappedData = TypeSafeMapper.mapObject(response as User, {
      exclude: ['password'],
    });
    const data = BukkaResponse.GetSingleDataResponse('user', mappedData);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Put()
  @ApiOperation({ summary: 'Update user details' })
  @ApiBody({ type: AdminUpdateUserDto })
  async updateUser(
    @Body() updateUserDto: AdminUpdateUserDto,
    @Res() res: Response,
  ) {
    const user = TypeSafeMapper.mapObject(updateUserDto, {
      exclude: [
        'password',
        'confirmationCode',
        'confirmationCodeExpires',
        'passwordResetToken',
        'passwordResetExpires',
      ],
    });
    const response = await this.userRepository.adminUpdateUserAsync(user);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Delete a user by user ID' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    example: 12,
  })
  async deleteUserAccount(
    @Param('userId') userId: number,
    @Res() res: Response,
  ) {
    const result = await this.userRepository.deleteUser(userId);
    return res.status(result.responseCode).json(result);
  }
}
