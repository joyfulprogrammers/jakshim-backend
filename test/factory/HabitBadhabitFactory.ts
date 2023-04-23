import { Factory } from '@mikro-orm/seeder';
import { HabitBadhabit } from 'src/entity/domain/habitBadhabit/HabitBadhabit.entity';

export class HabitBadhabitFactory extends Factory<HabitBadhabit> {
  model = HabitBadhabit;

  static createEntity(entity?: Partial<HabitBadhabit>): HabitBadhabit {
    return Object.assign(new HabitBadhabit(), {
      ...entity,
    } as HabitBadhabit);
  }

  definition(): HabitBadhabit {
    return HabitBadhabitFactory.createEntity();
  }
}
