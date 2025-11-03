import { Module } from '@nestjs/common';
import { PrismaModule } from '../../db/db.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleService } from './google.service';
import { AuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleService, AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
