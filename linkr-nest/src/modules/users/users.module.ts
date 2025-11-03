import { Module } from '@nestjs/common';
import { PrismaModule } from '../../db/db.module';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
