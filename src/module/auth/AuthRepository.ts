import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from '../../entity/domain/user/User.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: EntityRepository<User>,
  ) {}

  async findByNickname(nickname: string): Promise<User | null> {
    return await this.authRepository.findOne({ nickname });
  }
}
