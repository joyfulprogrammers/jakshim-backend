import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../entity/domain/user/User.entity';
import { UserService } from '../user/UserService';
import { AuthRepository } from './AuthRepository';
import { AuthSignInRequest } from './dto/AuthSignInRequest';
import { AuthSignUpRequest } from './dto/AuthSignUpRequest';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
  ) {}

  async getAuthorizedUser(req: AuthSignInRequest): Promise<User> {
    const user = await this.userService.findByEmail(req.email);

    if (user === null) {
      throw new NotFoundException({
        message: '이메일 또는 비밀번호를 확인해주세요',
      });
    }

    await user.validatePassword(req.password);

    return user;
  }

  async signup(req: AuthSignUpRequest) {
    const user = await this.userService.findByEmail(req.email);

    if (user !== null) {
      throw new ConflictException({
        message: '이미 가입된 이메일입니다.',
      });
    }

    await this.authRepository.save(req);
  }
}
