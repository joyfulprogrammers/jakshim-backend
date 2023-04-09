import { Factory, faker } from '@mikro-orm/seeder';
import { User } from 'src/entity/domain/user/User.entity';

export class UserFactory extends Factory<User> {
  model = User;

  static createEntity(entity?: Partial<User>): User {
    return Object.assign(new User(), {
      nickname: faker.name.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...entity,
    } as User);
  }

  definition(): Partial<User> {
    return UserFactory.createEntity();
  }
}
