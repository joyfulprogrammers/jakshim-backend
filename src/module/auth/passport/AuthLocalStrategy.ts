import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../AuthService';
import { AuthSignInRequest } from '../dto/AuthSignInRequest';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthSessionDto } from '../dto/AuthSessionDto';

@Injectable()
export class AuthLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(request: any): Promise<AuthSessionDto> {
    const authRequest = plainToInstance(AuthSignInRequest, request.body);
    const user = await this.authService.validateUser(authRequest.nickname);

    return AuthSessionDto.create(user);
  }
}
