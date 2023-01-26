import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/domain/user/User.entity';
import { UserRepository } from './UserRepository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async find(id: number): Promise<User | null> {
    return await this.userRepository.find(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }
}
