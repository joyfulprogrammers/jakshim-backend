import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { AuthSignInRequest } from '../dto/AuthSignInRequest';

/**
 * https://docs.nestjs.com/security/authentication#built-in-passport-guards
 * This Guard invokes the Passport strategy and kicks off the steps described above.
 */

@Injectable()
export class AuthLocalGuard extends AuthGuard('local') {
  override async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authSignInRequest = plainToInstance(AuthSignInRequest, request.body);
    await this.validateRequest(authSignInRequest);
    console.log('AuthLocalGuard1');
    const result = (await super.canActivate(context)) as boolean;

    console.log('AuthLocalGuard2', result);
    await super.logIn(request);

    return result;
  }

  async validateRequest(authSignInRequest: AuthSignInRequest): Promise<void> {
    const validationErrors: ValidationError[] = await validate(
      authSignInRequest,
    );

    console.log('validationErrors', validationErrors);

    if (ValidationError.length > 0) {
      throw new BadRequestException(validationErrors);
    }
  }
}
