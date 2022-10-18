import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/domain/user/User.entity';
import { UserSaveRequest } from './dto/UserSaveRequest';
import { UserRepository } from './repository/UserRepository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async save(dto: UserSaveRequest) {
    await this.userRepository.save(dto);
  }
}
