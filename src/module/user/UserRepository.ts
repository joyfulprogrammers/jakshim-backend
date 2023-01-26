import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { User } from '../../entity/domain/user/User.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async find(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ email });
  }
}
