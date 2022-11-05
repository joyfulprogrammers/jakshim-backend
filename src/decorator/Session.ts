import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthSessionDto } from '../module/auth/dto/AuthSessionDto';

export const Session = createParamDecorator(
  (_data, ctx: ExecutionContext): AuthSessionDto => {
    const request = ctx.switchToHttp().getRequest();

    console.log('Session decorator', request.session, request);

    if (!request.session) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    const authSessionDto: AuthSessionDto = request.session.passport.user;
    authSessionDto.isFirstSignIn = request.isFirstSignIn === true;

    return authSessionDto;
  },
);
