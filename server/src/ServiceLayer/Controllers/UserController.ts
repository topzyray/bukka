import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
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
import {
  ProfileUpdateDto,
  UpdateUserDto,
  UserFilterDto,
} from 'src/DomainLayer/Dtos/UserDto';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import { UserRepository } from 'src/BussinessLayer/UserRepository';
import { TypeSafeMapper } from 'src/MiddlewareLayer/Mappings/TypeSafeMapper';
import { User } from 'src/DomainLayer/Models/User';
import { TokenTypeEnum } from 'src/DomainLayer/Enums/TokenTypeEnum';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/users`)
@ApiBearerAuth(TokenTypeEnum.ACCESS_TOKEN)
@ApiSecurity('device-id')
@UseGuards(JwtAuthGuard)
@ApiTags('User')
export class UserController {
  constructor(private readonly _userRepository: UserRepository) {}

  @Get()
  @ApiOperation({ summary: 'Get user profiles by filters' })
  async getUserByFilters(
    @Query() request: UserFilterDto,
    @Res() res?: Response,
  ) {
    const response = await this._userRepository.findByFilters(request);
    // const mappedData = {
    //   ...response,
    //   data: response.data.map((data) =>
    //     TypeSafeMapper.map(data, UserResponse, UserDto),
    //   ),
    // };
    const mappedData = TypeSafeMapper.mapArray(response.data, {
      exclude: ['password'],
    });

    const data = BukkaResponse.GetPagedDataResponse('Profiles', mappedData);
    return BukkaResponse.GetStatusResponse(
      data,
      res as Response<any, Record<string, any>>,
    );
  }

  @Get('me/profile')
  @ApiOperation({ summary: 'Get logged in user data' })
  async getUserData(@Res() res: Response) {
    const user = await this._userRepository.getLoggedInUserData();
    const mappedData = TypeSafeMapper.mapObject(user as User, {
      exclude: ['password'],
    });
    const data = BukkaResponse.GetSingleDataResponse('User', mappedData);
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

  @Put()
  @ApiOperation({ summary: 'User details updates' })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    const response =
      await this._userRepository.updateUserDataAsync(updateUserDto);
    response.responseData = TypeSafeMapper.mapObject(response?.responseData, {
      exclude: ['password'],
    });
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Put('profile')
  @ApiOperation({ summary: 'User profile update details' })
  @ApiBody({ type: ProfileUpdateDto })
  async userProfileUpdate(
    @Body() profileUpdateDto: ProfileUpdateDto,
    @Res() res: Response,
  ) {
    const response =
      await this._userRepository.updateUserProfileAsync(profileUpdateDto);
    response.responseData = TypeSafeMapper.mapObject(response?.responseData, {
      exclude: ['password'],
    });
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Put('profile/complete-onboarding')
  @ApiOperation({ summary: 'Complete logged in user onboarding' })
  async completeProfileOnboarding(@Res() res: Response) {
    const response = await this._userRepository.completeProfileOnboarding();
    response.responseData = TypeSafeMapper.mapObject(response?.responseData, {
      exclude: ['password'],
    });
    return BukkaResponse.GetStatusResponse(response, res);
  }

  // @Delete()
  // @ApiOperation({ summary: 'Delete a user by user ID' })
  // async deleteUserAccount(@Res() res: Response) {
  //   const result = await this._userRepository.deleteUser();
  //   return res.status(result.responseCode).json(result);
  // }
}
