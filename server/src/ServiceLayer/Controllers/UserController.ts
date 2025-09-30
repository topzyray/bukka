import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
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
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import {
  ProfileUpdateDto,
  UpdateUserDto,
  UserDto,
  UserFilterDto,
} from 'src/DomainLayer/Dtos/UserDto';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { UserResponse } from 'src/DomainLayer/Models/UserResponse';
import { UserRepository } from 'src/BussinessLayer/UserRepository';
import { TypeSafeMapper } from 'src/MiddlewareLayer/Mappings/TypeSafeMapper';
import { User } from 'src/DomainLayer/Models/User';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/users`)
@UseGuards(JwtAuthGuard)
@ApiTags('User API')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly _userRepository: UserRepository) {}

  @Get()
  @ApiOperation({ summary: 'Get user profiles by filters' })
  async getUserByFilters(
    @Query() request: UserFilterDto,
    @Res() res?: Response,
  ) {
    const response = await this._userRepository.findByFilters(request);
    const mappedData = {
      ...response,
      data: response.data.map((data) =>
        TypeSafeMapper.map(data, UserResponse, UserDto),
      ),
    };
    const data = BukkaResponse.GetPagedDataResponse('Profiles', mappedData);
    return BukkaResponse.GetStatusResponse(
      data,
      res as Response<any, Record<string, any>>,
    );
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    example: 12,
  })
  async getUserById(@Param('userId') userId: number, @Res() res: Response) {
    const user = await this._userRepository.findUserById(Number(userId));
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const mappedData = TypeSafeMapper.map(user as User, UserResponse, UserDto);
    const data = BukkaResponse.GetSingleDataResponse('user', mappedData);
    return BukkaResponse.GetStatusResponse(data, res);
  }

  // @Get('/getByEmail/:email')
  // @ApiOperation({ summary: 'Get a user by email' })
  // @ApiParam({
  //   name: 'email',
  //   description: 'The email of the user',
  //   example: 'example@bukka.com',
  // })
  // async getUserByEmail(@Param('email') email: string, @Res() res: Response) {
  //   const response = await this._userRepository.findUserByEmail(email);
  //   const mappedData = TypeSafeMapper.map(
  //     response as User,
  //     UserResponse,
  //     UserDto,
  //   );
  //   const data = BukkaResponse.GetSingleDataResponse('User', mappedData);
  //   return BukkaResponse.GetStatusResponse(data, res);
  // }

  @Put(':userId')
  @ApiOperation({ summary: 'User user details' })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const response = await this._userRepository.updateUserDataAsync(
      userId,
      updateUserDto,
    );
    response.responseData = TypeSafeMapper.map(
      response.responseData,
      UserDto,
      UserResponse,
    );
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Put(':userId/profile')
  @ApiOperation({ summary: 'User profile update details' })
  @ApiBody({ type: ProfileUpdateDto })
  async userProfileUpdate(
    @Param('userId') userId: number,
    @Body() profileUpdateDto: ProfileUpdateDto,
    @Res() res: Response,
  ) {
    const response = await this._userRepository.updateUserProfileAsync(
      userId,
      profileUpdateDto,
    );
    response.responseData = TypeSafeMapper.map(
      response.responseData,
      UserDto,
      UserResponse,
    );
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
    const result = await this._userRepository.deleteUser(userId);
    return res.status(result.responseCode).json(result);
  }
}
