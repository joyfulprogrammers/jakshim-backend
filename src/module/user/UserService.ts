import { Injectable } from '@nestjs/common';
import { UserSaveRequest } from './dto/UserSaveRequest';
import { UserRepository } from './UserRepository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async save(req: UserSaveRequest) {
    return this.userRepository.save(req);
  }
}
