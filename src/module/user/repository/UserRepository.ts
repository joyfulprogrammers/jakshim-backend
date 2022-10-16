import { Repository } from 'typeorm';
import { User } from '../../../entity/domain/user/User.entity';

export class UserRepository extends Repository<User> {}
