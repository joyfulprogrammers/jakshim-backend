import { Injectable } from '@nestjs/common';
import { User } from '../../entity/domain/user/User.entity';
import { UserService } from '../user/UserService';
import { AuthRepository } from './AuthRepository';
import { AuthSignUpRequest } from './dto/AuthSignupRequest';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
  ) {}

  async validateUser(nickname: string): Promise<User | null> {
    const user = await this.userService.findByNickname(nickname);
    if (user) {
      const { ...result } = user; // const { password, ...result } = user; 로 되어있었음
      return result;
    }

    return null;
  }

  async signup(req: AuthSignUpRequest) {
    await this.authRepository.save(req);
  }
}
