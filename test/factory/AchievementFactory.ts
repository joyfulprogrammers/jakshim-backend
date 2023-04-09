import { Factory, faker } from '@mikro-orm/seeder';
import { Achievement } from 'src/entity/domain/achievement/Achievement.entity';

export class AchievementFactory extends Factory<Achievement> {
  model = Achievement;

  static createEntity(entity?: Partial<Achievement>): Achievement {
    const targetCount = faker.datatype.number({ min: 1 });
    return Object.assign(new Achievement(), {
      count: faker.datatype.number({ min: 0, max: targetCount }),
      targetCount,
      ...entity,
    } as Achievement);
  }

  definition(): Achievement {
    return AchievementFactory.createEntity();
  }
}
