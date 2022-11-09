import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { User } from '../../entity/domain/user/User.entity';
import { UserSaveRequest } from '../user/dto/UserSaveRequest';
import { UserService } from '../user/UserService';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(nickname: string): Promise<User | null> {
    const user = await this.userService.findByNickname(nickname);
    if (user) {
      const { ...result } = user; // const { password, ...result } = user; 로 되어있었음
      return result;
    }

    return null;
  }

  async signup(nickname: string): Promise<boolean> {
    const req = plainToInstance(UserSaveRequest, { nickname });
    try {
      await this.userService.save(req);
      return true;
    } catch {
      return false;
    }
  }
}
