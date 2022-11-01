import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { GenericValidation } from '../pipes/GenericValidation.pipe';
import { ResetLinkDto } from '../reset_token/dto/ResetLinkDto';
import { ResetPassDto } from '../reset_token/dto/ResetPassDto';
import { ResetTokenService } from '../reset_token/reset_token.service';
import { CreateUserDto } from '../user/dto/CreateUserDto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private resetTokenService: ResetTokenService,
  ) {}

  @Post('signup')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signIn(@Body() authDto: AuthDto) {
    return this.authService.signIn(authDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(+userId, refreshToken);
  }

  @Post('reset/link')
  async resetLink(@Body(new GenericValidation()) dto: ResetLinkDto) {
    console.log('in reset link');

    return this.resetTokenService.createResetLink(dto);
  }

  @Post('reset/password')
  async resetPass(@Body(new GenericValidation()) dto: ResetPassDto) {
    return this.resetTokenService.resetPassword(dto);
  }
}
