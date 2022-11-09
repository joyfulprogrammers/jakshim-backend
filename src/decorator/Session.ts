import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type Session = any;

export const Session = createParamDecorator(
  (_data, ctx: ExecutionContext): Session => {
    const request = ctx.switchToHttp().getRequest();
    const session = request.session;

    return session;
  },
);
