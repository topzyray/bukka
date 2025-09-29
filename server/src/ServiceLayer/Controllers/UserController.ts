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
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UserRepository } from 'src/BusinessLayer/UserRepository';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import {
  AddUserFileDto,
  ProfileUpdateDto,
  UpdateUserDto,
  UserDto,
  UserFilterDto,
} from 'src/DomainLayer/Dtos/UserDto';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { InuResponse } from 'src/DomainLayer/Models/InuResponse';
import { mapper } from 'src/InfrastructureLayer/Services/MapperService';
import { UserResponse } from 'src/DomainLayer/Models/UserResponse';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/users`)
@UseGuards(JwtAuthGuard)
@ApiTags('User API')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly _userRepository: UserRepository) {}

  @Get('/getById/:userId')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user',
    example: 12,
  })
  async getUserById(@Param('userId') userId: number, @Res() res: Response) {
    const response = await this._userRepository.findUserById(Number(userId));
    const mappedData = mapper.map(response, UserDto, UserResponse);
    const data = InuResponse.GetSingleDataResponse('user', mappedData);

    return InuResponse.GetStatusResponse(data, res);
  }

  @Get('/getByEmail/:email')
  @ApiOperation({ summary: 'Get a user by email' })
  @ApiParam({
    name: 'email',
    description: 'The email of the user',
    example: 'example@inu.com',
  })
  async getUserByEmail(@Param('email') email: string, @Res() res: Response) {
    const response = await this._userRepository.findUserByEmail(email);
    const mappedData = mapper.map(response?.user, UserDto, UserResponse);
    mappedData.counts = response?.counts;
    const data = InuResponse.GetSingleDataResponse('user', mappedData);
    return InuResponse.GetStatusResponse(data, res);
  }

  @Get('/getByFilters')
  @ApiOperation({ summary: 'Get user profiles by filters' })
  async getUserByFilters(
    @Query() request?: UserFilterDto,
    @Res() res?: Response,
  ) {
    const response = await this._userRepository.findByFilters(request);

    const mappedData = {
      ...response,
      data: response.data.map((data) =>
        mapper.map(data, UserDto, UserResponse),
      ),
    };

    const data = InuResponse.GetPagedDataResponse('profiles', mappedData);

    return InuResponse.GetStatusResponse(data, res);
  }

  @Put('/updateUser/:userId')
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
    response.responseData = mapper.map(
      response.responseData,
      UserDto,
      UserResponse,
    );
    return InuResponse.GetStatusResponse(response, res);
  }

  @Put('/updateUserProfile/:userId')
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
    response.responseData = mapper.map(
      response.responseData,
      UserDto,
      UserResponse,
    );
    return InuResponse.GetStatusResponse(response, res);
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
    const result = await this._userRepository.deleteUser(userId);
    return res.status(result.responseCode).json(result);
  }

  @Post('/connectFile')
  @ApiOperation({ summary: 'Connect user file' })
  async connectUserFile(@Body() dto: AddUserFileDto, @Res() res: Response) {
    const response = await this._userRepository.addFileToUser(
      dto.userId,
      dto.fileId,
    );
    return InuResponse.GetStatusResponse(response, res);
  }
}

