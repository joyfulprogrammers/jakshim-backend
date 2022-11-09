import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/domain/user/User.entity';
import { UserSaveRequest } from './dto/UserSaveRequest';
import { UserRepository } from './UserRepository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByNickname(nickname: string): Promise<User | null> {
    return await this.userRepository.findByNickname(nickname);
  }

  async save(req: UserSaveRequest) {
    return await this.userRepository.save(req);
  }
}
