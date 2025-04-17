/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterRequestDto } from './dtos/auth-register-request.dto';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/auth-login-request.dto';
import { AuthGuard } from './gaurds/auth.guard';
import { Request } from '@nestjs/common';

@Controller('api/auth')
export class AuthController {
  //post signup
  //post login
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public register(@Body() body: RegisterRequestDto) {
    return this.authService.register(body);
  }

  @Post('login')
  public login(@Body() body: LoginRequestDto) {
    return this.authService.login(body);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return req.user;
  }
}
