import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/v1/profile')
export class UserController {
  constructor(private readonly user: UsersService) {}

  @Get()
  async profile(@Req() req: Request) {
    return this.user.getById(req.user.userId);
  }
}
