import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/DomainLayer/Decorators/PublicDecorator';
import { InuResponse } from 'src/DomainLayer/Models/InuResponse';
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
import { AuthRepository } from 'src/BusinessLayer/AuthRepository';
import { EmailService } from 'src/InfrastructureLayer/Services/EmailService';
import { JwtAuthGuard } from 'src/MiddlewareLayer/Guards/JwtAuthGuard';
import { CreateUserDto, UserDto } from 'src/DomainLayer/Dtos/UserDto';
import { mapper } from 'src/InfrastructureLayer/Services/MapperService';
import { UserResponse } from 'src/DomainLayer/Models/UserResponse';

@Controller(`${BaseApiRoutesConstant.BASE_URL}/auth`)
@ApiTags('Auth API')
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly _authRepository: AuthRepository,
    private readonly notif: EmailService,
  ) {}

  @Public()
  @Post('/signup')
  @ApiOperation({ summary: 'Create an account.' })
  @ApiBody({ type: CreateUserDto })
  async signup(@Body() request: CreateUserDto, @Res() res: Response) {
    const response = await this._authRepository.registerUser(request);
    if (response.status) {
      await this.notif.sendVerificationEmail(response.responseData);
      response.responseData = mapper.map(
        response.responseData,
        UserDto,
        UserResponse,
      );
    }
    return InuResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'Login to account' })
  @ApiBody({ type: LoginDto })
  async login(@Body() request: LoginDto, @Res() res: Response) {
    const response = await this._authRepository.login(request);
    return InuResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('/confirmEmail')
  @ApiOperation({ summary: 'Confirm users email' })
  @ApiBody({ type: ConfirmEmailDto })
  async verifyEmail(@Body() request: ConfirmEmailDto, @Res() res: Response) {
    const response = await this._authRepository.verifyEmail(request);
    return InuResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('/resendConfirmationEmail')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiBody({ type: ResendConfirmEmailDto })
  async resendEmailVerification(
    @Body() req: ResendConfirmEmailDto,
    @Res() res: Response,
  ) {
    const response = await this._authRepository.resendConfirmationEmail(req);

    if (response.status) {
      await this.notif.sendVerificationEmail(response.responseData);
    }
    response.responseData = null;
    return InuResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('/refreshToken')
  @ApiOperation({ summary: 'Refreshes user token' })
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(@Body() req: RefreshTokenDto, @Res() res: Response) {
    const response = await this._authRepository.refreshToken(req);
    return InuResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('/forgotPassword')
  @ApiOperation({ summary: 'Forgot password api' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() req: ForgotPasswordDto, @Res() res: Response) {
    const response = await this._authRepository.forgotPassword(req);

    if (response.status) {
      await this.notif.sendPasswordResetEmail(response.responseData);
    }
    response.responseData = null;
    return InuResponse.GetStatusResponse(response, res);
  }

  @Public()
  @Post('/resetPassword')
  @ApiOperation({ summary: 'Reset and update user password' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() req: ResetPasswordDto, @Res() res: Response) {
    const response = await this._authRepository.resetPassword(req);
    return InuResponse.GetStatusResponse(response, res);
  }

  @Public()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/changePassword')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(@Body() req: ChangePasswordDto, @Res() res: Response) {
    const response = await this._authRepository.changePassword(req);
    return InuResponse.GetStatusResponse(response, res);
  }
}
