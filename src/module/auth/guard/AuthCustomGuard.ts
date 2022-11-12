import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { AuthService } from '../AuthService';
import { AuthSignInRequest } from '../dto/AuthSignInRequest';

@Injectable()
export class AuthCustomGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authSignInRequest = plainToInstance(AuthSignInRequest, request.body);
    await this.validateRequest(authSignInRequest);

    const user = await this.authService.validateUser(
      authSignInRequest.nickname,
    );
    request.session.user = user;

    const result = !!user;
    return result;
  }

  async validateRequest(authSignInRequest: AuthSignInRequest): Promise<void> {
    const validationErrors: ValidationError[] = await validate(
      authSignInRequest,
    );

    if (ValidationError.length > 0) {
      throw new BadRequestException(validationErrors);
    }
  }
}
