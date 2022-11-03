import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/domain/user/User.entity';
import { UserRepository } from './UserRepository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByNickname(nickname: string): Promise<User | null> {
    return await this.userRepository.findByNickname(nickname);
  }
}
