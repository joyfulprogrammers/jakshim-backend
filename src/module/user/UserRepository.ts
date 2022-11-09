import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { User } from '../../entity/domain/user/User.entity';
import { UserSaveRequest } from './dto/UserSaveRequest';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async findByNickname(nickname: string): Promise<User | null> {
    return await this.userRepository.findOne({ nickname });
  }

  async save(req: UserSaveRequest) {
    const user = plainToInstance(User, req);

    await this.userRepository.persistAndFlush(user);
  }
}
