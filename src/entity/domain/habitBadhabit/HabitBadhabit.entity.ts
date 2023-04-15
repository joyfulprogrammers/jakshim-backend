import {
  Entity,
  IdentifiedReference,
  ManyToOne,
  Reference,
} from '@mikro-orm/core';
import { Habit } from '../habit/Habit.entity';
import { User } from '../user/User.entity';

@Entity({ tableName: 'habit_badhabit' })
export class HabitBadhabit {
  @ManyToOne({ index: true })
  habit: IdentifiedReference<Habit>;

  @ManyToOne({ index: true })
  user: IdentifiedReference<User>;

  static create(habitId: number, userId: number) {
    const habitBadhabit = new HabitBadhabit();

    habitBadhabit.habit = Reference.createFromPK(Habit, habitId);
    habitBadhabit.user = Reference.createFromPK(User, userId);

    return habitBadhabit;
  }
}
