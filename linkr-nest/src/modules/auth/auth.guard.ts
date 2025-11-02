import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import type { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (request) {
      const token = this.extractToken(request);
      return this.validateToken(token, request);
    }
    return false;
  }

  extractToken(request: Request): string {
    // Extract token from cookies
    const token = request.cookies['accessToken'] as string;
    if (!token) {
      throw new UnauthorizedException('Access token is missing');
    }
    return token;
  }

  async validateToken(token: string, request: Request): Promise<boolean> {
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
