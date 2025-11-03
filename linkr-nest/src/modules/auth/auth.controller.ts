import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  BadRequestException,
  Query,
  UnauthorizedException,
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
import { randomUUID } from 'crypto';
import { GoogleService } from './google.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly googleService: GoogleService,
  ) {}

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

  // Google

  @Get('google')
  redirectToGoogle(@Res() res: Response) {
    const state = randomUUID();
    const url = this.googleService.getAuthUrl(state);
    console.log('state1', state);
    return res
      .cookie('authState', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
      .json({ redirect: url });
  }

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('state') returnedState: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    // Verify state
    console.log('cb: ', 'callback', code);
    console.log('state2', returnedState);
    const state = req.cookies['authState'] as string;
    console.log('state3', state);
    if (!state || state !== returnedState) {
      throw new UnauthorizedException('Invalid state');
    }

    console.log('cb: ', 'callback2', code);

    // Exchange code for tokens
    const tokens = await this.googleService.getTokens(code);
    console.log('tokens ', tokens);

    // Verify user's id_token
    const payload = await this.googleService.verifyIdToken(
      tokens.id_token as string,
    );

    // Get user profile
    const profile = await this.googleService.getUserProfile(
      payload,
      tokens.access_token as string,
    );

    const { accessToken, refreshToken } =
      await this.auth.handleOAuthUser(profile);

    setAuthCookies(res, accessToken, refreshToken).json({
      message: 'Login successful',
    });
  }
}
