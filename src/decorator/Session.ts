import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

type Session = any;

export const Session = createParamDecorator(
  (_data, ctx: ExecutionContext): Session => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.session || !request.session.passport) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    return request.session.passport.user;
  },
);
