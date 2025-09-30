import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { UserDto } from 'src/DomainLayer/Dtos/UserDto';
import { UserResponse } from 'src/DomainLayer/Models/UserResponse';
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

@Controller(`${AdminApiRoutesConstant.BASE_URL}/users`)
@ApiTags('Admin User Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminAuthGuard)
export class UserManagementController {
  constructor(
    private userRepository: UserRepository,
    private readonly notif: EmailService,
  ) {}

  @Post('/create')
  @ApiOperation({ summary: 'Create admin account.' })
  @ApiBody({ type: CreateAdminUserDto })
  async createAdminUser(
    @Body() request: CreateAdminUserDto,
    @Res() res: Response,
  ) {
    const response = await this.userRepository.createUserAsync(request);
    if (response.status) {
      await this.notif.sendMail(response.responseData);
      response.responseData = TypeSafeMapper.map(
        response.responseData,
        UserResponse,
        UserDto,
      );
    }
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get('/overview')
  @ApiOperation({ summary: 'Get users stats' })
  async getUserSummary(@Res() res?: Response) {
    const response = await this.userRepository.getAdminOverview();

    const data = BukkaResponse.GetPagedDataResponse('overview', response);

    return BukkaResponse.GetStatusResponse(data, res as any);
  }

  @Post('/updateUser')
  @ApiOperation({ summary: 'Update user details' })
  @ApiBody({ type: AdminUpdateUserDto })
  async updateUser(
    @Body() updateUserDto: AdminUpdateUserDto,
    @Res() res: Response,
  ) {
    const user = TypeSafeMapper.map(updateUserDto, AdminUpdateUserDto, UserDto);
    const response = await this.userRepository.adminUpdateUserAsync(user);

    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Get('/getByFilters')
  @ApiOperation({ summary: 'Get users by filters' })
  async getUsersByFilters(
    @Query() request: AdminUserFilterDto,
    @Res() res?: Response,
  ) {
    const response = await this.userRepository.adminFindByFilters(request);

    const mappedData = {
      ...response,
      data: response.data.map((data) =>
        TypeSafeMapper.map(data, UserDto, UserResponse),
      ),
    };

    const data = BukkaResponse.GetPagedDataResponse('users', mappedData);

    return BukkaResponse.GetStatusResponse(data, res as any);
  }

  @Get('/:userId')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    example: 3,
  })
  async getUserById(@Param('userId') userId: number, @Res() res: Response) {
    const response = await this.userRepository.findUserById(Number(userId));
    const mappedData = TypeSafeMapper.map(
      response as User,
      UserResponse,
      UserDto,
    );
    const data = BukkaResponse.GetSingleDataResponse('user', mappedData);

    return BukkaResponse.GetStatusResponse(data, res);
  }

  @Delete('/deleteUser/:userId')
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
