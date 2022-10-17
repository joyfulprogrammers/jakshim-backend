import { Repository } from 'typeorm';
import { User } from '../../../entity/domain/user/User.entity';
import { CustomRepository } from '../../../ex-custom-repository/typeorm-ex.decorator';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
