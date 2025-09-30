import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from 'src/DomainLayer/Decorators/PublicDecorator';
import { BukkaResponse } from 'src/DomainLayer/Models/BukkaResponse';
import {
  ChangePasswordDto,
  ConfirmEmailDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  ResendConfirmEmailDto,
  ResetPasswordDto,
} from 'src/DomainLayer/Dtos/AuthDto';
import { BaseApiRoutesConstant } from 'src/DomainLayer/Constants/BaseApiRoutesConstant';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { CreateUserDto } from 'src/DomainLayer/Dtos/UserDto';
import { AuthRepository } from 'src/BussinessLayer/AuthRepository';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/auth`)
@ApiTags('Auth API')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly _authRepository: AuthRepository) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Create an account.' })
  @ApiBody({ type: CreateUserDto })
  async signup(@Body() request: CreateUserDto, @Res() res: Response) {
    const response = await this._authRepository.registerUser(request);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login to account' })
  @ApiBody({ type: LoginDto })
  async login(@Body() request: LoginDto, @Res() res: Response) {
    const response = await this._authRepository.login(request);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('confirm-email')
  @ApiOperation({ summary: 'Confirm users email' })
  @ApiBody({ type: ConfirmEmailDto })
  async verifyEmail(@Body() request: ConfirmEmailDto, @Res() res: Response) {
    const response = await this._authRepository.verifyEmail(request);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('resend-confirmation-email')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiBody({ type: ResendConfirmEmailDto })
  async resendEmailVerification(
    @Body() req: ResendConfirmEmailDto,
    @Res() res: Response,
  ) {
    const response = await this._authRepository.resendConfirmationEmail(req);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refreshes user token' })
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(@Body() req: RefreshTokenDto, @Res() res: Response) {
    const response = await this._authRepository.refreshToken(req);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password api' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() req: ForgotPasswordDto, @Res() res: Response) {
    const response = await this._authRepository.forgotPassword(req);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset and update user password' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() req: ResetPasswordDto, @Res() res: Response) {
    const response = await this._authRepository.resetPassword(req);
    return BukkaResponse.GetStatusResponse(response, res);
  }

  @Public()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@Body() req: ChangePasswordDto, @Res() res: Response) {
    const response = await this._authRepository.changePassword(req);
    return BukkaResponse.GetStatusResponse(response, res);
  }
}
