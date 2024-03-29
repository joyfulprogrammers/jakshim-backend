import { Factory, faker } from '@mikro-orm/seeder';
import { Habit } from 'src/entity/domain/habit/Habit.entity';
import { DateTimeUtil } from '../../src/entity/util/DateTimeUtil';

export class HabitFactory extends Factory<Habit> {
  model = Habit;

  static createEntity(entity?: Partial<Habit>): Habit {
    return Object.assign(new Habit(), {
      name: faker.random.word(),
      targetCount: faker.datatype.number({ min: 0 }),
      startedTime: DateTimeUtil.toLocalTimeBy('00:00'),
      endedTime: DateTimeUtil.toLocalTimeBy('23:59'),
      isAllDay: faker.datatype.boolean(),
      cycleMonday: faker.datatype.boolean(),
      cycleTuesday: faker.datatype.boolean(),
      cycleWednesday: faker.datatype.boolean(),
      cycleThursday: faker.datatype.boolean(),
      cycleFriday: faker.datatype.boolean(),
      cycleSaturday: faker.datatype.boolean(),
      cycleSunday: faker.datatype.boolean(),
      cycleWeek: faker.datatype.boolean(),
      ...entity,
    } as Habit);
  }

  definition(): Partial<Habit> {
    return HabitFactory.createEntity();
  }
}
