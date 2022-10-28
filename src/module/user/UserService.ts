import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/domain/user/User.entity';
import { UserLoginRequest } from './dto/UserLoginRequest';
import { UserSaveRequest } from './dto/UserSaveRequest';
import { UserRepository } from './UserRepository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async save(req: UserSaveRequest) {
    return await this.userRepository.save(req);
  }

  async login(req: UserLoginRequest): Promise<User | null> {
    return await this.userRepository.findByNickname(req.nickname);
  }
}
