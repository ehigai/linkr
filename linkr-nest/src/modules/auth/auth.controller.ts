import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import {
  accessTokenCookieOptions,
  clearAuthCookies,
  refreshTokenCookieOptions,
  setAuthCookies,
} from '../../common/cookies.util';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: RegisterDto,
  ) {
    const { email, firstName, lastName, password, confirmPassword } = body;
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    await this.auth.register({ email, firstName, lastName, password });
    const { accessToken, refreshToken } = await this.auth.login({
      email,
      password,
      userAgent: req.headers['user-agent'] as string,
    });
    setAuthCookies(res, accessToken, refreshToken).json({
      message: 'Login successful',
    });
  }

  @Post('login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: LoginDto,
  ) {
    const { accessToken, refreshToken } = await this.auth.login({
      email: body.email,
      password: body.password,
      userAgent: req.headers['user-agent'] as string,
    });
    setAuthCookies(res, accessToken, refreshToken).json({
      message: 'Login successful',
    });
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const cookies =
      (req as unknown as { cookies?: Record<string, string> }).cookies || {};
    const accessToken = String(cookies['accessToken'] ?? '');
    await this.auth.logout(accessToken);
    clearAuthCookies(res).json({ message: 'Logged out' });
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const cookies =
      (req as unknown as { cookies?: Record<string, string> }).cookies || {};
    const refreshToken = String(cookies['refreshToken'] ?? '');
    const { accessToken, newRefreshToken } =
      await this.auth.refresh(refreshToken);
    if (newRefreshToken)
      res.cookie('refreshToken', newRefreshToken, refreshTokenCookieOptions());
    res
      .cookie('accessToken', accessToken, accessTokenCookieOptions())
      .json({ message: 'Token refreshed' });
  }
}
