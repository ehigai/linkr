import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../db/db.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const cookies =
      (req as unknown as { cookies?: Record<string, string> }).cookies || {};
    const accessToken = String(cookies['accessToken'] ?? '');
    const payload = this.jwt.verify<{
      userId: string;
      sessionId: string;
      tokenType: 'access' | 'refresh';
    }>(accessToken, { audience: ['user'] });
    if (payload.tokenType !== 'access') return null;
    const session = await this.prisma.session.findUnique({
      where: { id: payload.sessionId },
    });
    if (!session) return null;
    return { userId: payload.userId, sessionId: payload.sessionId };
  }
}
