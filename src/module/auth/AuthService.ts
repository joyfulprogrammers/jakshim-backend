import { Injectable } from '@nestjs/common';
import { User } from '../../entity/domain/user/User.entity';
import { UserService } from '../user/UserService';
import { AuthRepository } from './AuthRepository';
import { AuthSignInRequest } from './dto/AuthSignInRequest';
import { AuthSignUpRequest } from './dto/AuthSignupRequest';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
  ) {}

  async getAuthorizedUser(req: AuthSignInRequest): Promise<User> {
    const user = await this.userService.findByEmail(req.email);

    await user.validatePassword(req.password);

    return user;
  }

  async signup(req: AuthSignUpRequest) {
    await this.authRepository.save(req);
  }
}
