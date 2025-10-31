import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../db/db.service';
import bcrypt from 'bcrypt';
type BcryptApi = {
  hash(data: string, rounds: number): Promise<string>;
  compare(data: string, hash: string): Promise<boolean>;
};
const bc = bcrypt as unknown as BcryptApi;
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private fiveDaysFromNow() {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d;
  }

  async register(payload: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) {
    const { email, firstName, lastName, password } = payload;
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('User Already exists');
    const hashed = await bc.hash(password, 10);
    return this.prisma.user.create({
      data: { email, firstName, lastName, password: hashed },
    });
  }

  async login(payload: { email: string; password: string; userAgent: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const isValid = await bc.compare(payload.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid email or password');

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        userAgent: payload.userAgent,
        expiresAt: this.fiveDaysFromNow(),
      },
    });
    if (!session) throw new InternalServerErrorException('An error occurred');

    const refreshToken = this.jwt.sign(
      { sessionId: session.id, tokenType: 'refresh' },
      { expiresIn: '5d' },
    );
    const accessToken = this.jwt.sign(
      { userId: user.id, sessionId: session.id, tokenType: 'access' },
      { expiresIn: '5m' },
    );
    return {
      accessToken,
      refreshToken,
      sessionId: session.id,
      userId: user.id,
    };
  }

  async logout(accessToken: string) {
    try {
      const payload = this.jwt.verify<{ sessionId: string }>(accessToken, {
        audience: ['user'],
      });
      await this.prisma.session.delete({
        where: { id: payload.sessionId },
      });
    } catch {
      throw new UnauthorizedException('Logout error');
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify<{
        sessionId: string;
        tokenType: 'access' | 'refresh';
      }>(refreshToken);
      if (payload.tokenType !== 'refresh')
        throw new Error('Invalid refresh token');
      const session = await this.prisma.session.findUnique({
        where: { id: payload.sessionId },
      });
      if (!session || session.expiresAt.getTime() <= Date.now())
        throw new UnauthorizedException('Session expired or not found');

      const shouldExtend =
        session.expiresAt.getTime() - Date.now() < 1000 * 60 * 60 * 24 * 2;
      if (shouldExtend) {
        await this.prisma.session.update({
          where: { id: session.id },
          data: { expiresAt: this.fiveDaysFromNow() },
        });
      }
      const newRefreshToken = shouldExtend
        ? this.jwt.sign(
            { sessionId: session.id, tokenType: 'refresh' },
            { expiresIn: '5d' },
          )
        : undefined;
      const accessToken = this.jwt.sign(
        { userId: session.userId, sessionId: session.id, tokenType: 'access' },
        { expiresIn: '5m' },
      );
      return { accessToken, newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
