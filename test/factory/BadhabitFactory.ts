import { Factory, faker } from '@mikro-orm/seeder';
import { Badhabit } from 'src/entity/domain/badhabit/Badhabit.entity';

export class BadhabitFactory extends Factory<Badhabit> {
  model = Badhabit;

  static createEntity(entity?: Partial<Badhabit>): Badhabit {
    return Object.assign(new Badhabit(), {
      name: faker.lorem.word(),
      ...entity,
    } as Badhabit);
  }

  definition(): Badhabit {
    return BadhabitFactory.createEntity();
  }
}
