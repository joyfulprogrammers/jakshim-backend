import {
  Entity,
  IdentifiedReference,
  ManyToOne,
  PrimaryKeyType,
  Reference,
} from '@mikro-orm/core';
import { Habit } from '../habit/Habit.entity';
import { Badhabit } from '../badhabit/Badhabit.entity';

@Entity({ tableName: 'habit_badhabit' })
export class HabitBadhabit {
  @ManyToOne({ primary: true })
  habit: IdentifiedReference<Habit>;

  @ManyToOne({ primary: true })
  badhabit: IdentifiedReference<Badhabit>;

  [PrimaryKeyType]?: [number, number]; // this is needed for proper type checks in `FilterQuery`

  static create(habitId: number, badhabitId: number) {
    const habitBadhabit = new HabitBadhabit();

    habitBadhabit.habit = Reference.createFromPK(Habit, habitId);
    habitBadhabit.badhabit = Reference.createFromPK(Badhabit, badhabitId);

    return habitBadhabit;
  }
}
