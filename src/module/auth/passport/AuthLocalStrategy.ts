import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../AuthService';
import { AuthSignInRequest } from '../dto/AuthSignInRequest';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthSessionDto } from '../dto/AuthSessionDto';

@Injectable()
export class AuthLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'nickname',
      passReqToCallback: true,
    });
    console.log('AuthLocalStrategy.constructor');
  }

  async validate(request: any): Promise<AuthSessionDto> {
    console.log('AuthLocalStrategy.validate', request.body);
    const authRequest = plainToClass(AuthSignInRequest, request.body);
    const user = await this.authService.validateUser(authRequest.nickname);

    return AuthSessionDto.create(user);
  }
}
