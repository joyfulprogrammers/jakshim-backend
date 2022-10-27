import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from '../../entity/domain/user/User.entity';
import { UserSaveRequest } from './dto/UserSaveRequest';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async save(req: UserSaveRequest) {
    const user = new User();
    user.nickname = req.nickname;
    await this.userRepository.persistAndFlush(user);
  }
}
