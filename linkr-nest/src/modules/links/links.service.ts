import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../db/db.service';

@Injectable()
export class LinksService {
  constructor(private readonly prisma: PrismaService) {}

  async createLink(userId: string, slug: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const existing = await this.prisma.link.findUnique({ where: { slug } });
    if (existing) throw new BadRequestException('Slug already in use');
    return this.prisma.link.create({ data: { slug, ownerId: userId } });
  }

  async getLinks(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { links: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user.links;
  }

  async createRedirection(userId: string, linkId: string, redirectTo: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const link = await this.prisma.link.findUnique({
      where: { id: linkId },
      include: { redirects: true },
    });
    if (!link) throw new NotFoundException('Link not found');
    if (link.ownerId !== userId) throw new BadRequestException('Invalid Link');

    const hasActive = link.redirects.some((r) => r.active);
    const redirect = await this.prisma.redirectLink.create({
      data: { url: redirectTo, linkId: link.id, active: !hasActive },
    });
    return this.prisma.link.update({
      where: { id: link.id },
      data: { redirects: { connect: { id: redirect.id } } },
      include: { redirects: true },
    });
  }

  async deleteRedirection(userId: string, redirectionLinkId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.redirectLink.delete({ where: { id: redirectionLinkId } });
  }

  async deleteLink(userId: string, linkId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    await this.prisma.redirectLink.deleteMany({ where: { linkId } });
    await this.prisma.link.delete({ where: { id: linkId } });
  }

  async toggleActiveLink(userId: string, linkId: string, toggleLinkId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const link = await this.prisma.link.findUnique({
      where: { id: linkId },
      include: { redirects: true },
    });
    if (!link) throw new NotFoundException('Link not found');
    if (link.ownerId !== userId) throw new BadRequestException('Invalid Link');

    const prevActive = link.redirects.find((r) => r.active);
    if (prevActive)
      await this.prisma.redirectLink.update({
        where: { id: prevActive.id },
        data: { active: false },
      });
    const toggled = await this.prisma.redirectLink.update({
      where: { id: toggleLinkId },
      data: { active: prevActive ? !prevActive.active : false },
    });
    return toggled;
  }
}
