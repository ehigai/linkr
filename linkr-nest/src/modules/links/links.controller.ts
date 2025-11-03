import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { CreateRedirectionDto } from './dto/create-redirection.dto';
import { User } from '../../common/decorators/user.decorator';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/v1/links')
export class LinksController {
  constructor(private readonly links: LinksService) {}

  @Post('/')
  async createLink(
    @User() user: { userId: string; sessionId: string },
    @Res() res: Response,
    @Body() body: CreateLinkDto,
  ) {
    const data = await this.links.createLink(user.userId, body.slug);
    res.status(201).json({ data, message: 'Link created successfully' });
  }

  @Get('/')
  async linksList(
    @User() user: { userId: string; sessionId: string },
    @Res() res: Response,
  ) {
    const data = await this.links.getLinks(user.userId);
    res.status(200).json({ data, message: 'success' });
  }

  @Post('r/:linkId')
  async createRedirection(
    @User() user: { userId: string; sessionId: string },
    @Res() res: Response,
    @Param('linkId') linkId: string,
    @Body() body: CreateRedirectionDto,
  ) {
    const data = await this.links.createRedirection(
      user.userId,
      linkId,
      body.redirectTo,
    );
    res.status(201).json({ data, message: 'Link added' });
  }

  @Delete('/r/:redirectionLinkId')
  async deleteRedirection(
    @User() user: { userId: string; sessionId: string },
    @Res() res: Response,
    @Param('redirectionLinkId') rid: string,
  ) {
    await this.links.deleteRedirection(user.userId, rid);
    res.status(200).json({ data: null, message: 'Deleted' });
  }

  @Delete('/:linkId')
  async deleteLink(
    @User() user: { userId: string; sessionId: string },
    @Res() res: Response,
    @Param('linkId') linkId: string,
  ) {
    await this.links.deleteLink(user.userId, linkId);
    res.status(200).json({ data: null, message: 'Deleted' });
  }

  @Get('toggle/:linkId/:toggleLinkId')
  async toggle(
    @User() user: { userId: string; sessionId: string },
    @Res() res: Response,
    @Param('linkId') linkId: string,
    @Param('toggleLinkId') toggleLinkId: string,
  ) {
    const data = await this.links.toggleActiveLink(
      user.userId,
      linkId,
      toggleLinkId,
    );
    res.status(200).json({ data, message: 'Link Toggled' });
  }
}
