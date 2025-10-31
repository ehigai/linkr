import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type AuthUser = { userId: string; sessionId: string };

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const raw = ctx.switchToHttp().getRequest();
    const req = raw as { user?: AuthUser };
    return req.user as AuthUser;
  },
);
