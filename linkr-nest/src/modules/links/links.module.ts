import { Module } from '@nestjs/common';
import { PrismaModule } from '../../db/db.module';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
