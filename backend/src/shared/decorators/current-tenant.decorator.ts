import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { TokenPayload } from '../../modules/auth/domain/token-payload.interface';

export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<{ user: TokenPayload }>();
    return req.user.tenantId;
  },
);
