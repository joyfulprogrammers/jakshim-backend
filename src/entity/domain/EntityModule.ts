import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Achievement } from './achievement/Achievement.entity';
import { Badhabit } from './badhabit/Badhabit.entity';
import { Habit } from './habit/Habit.entity';
import { HabitBadhabit } from './habitBadhabit/HabitBadhabit.entity';
import { User } from './user/User.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Badhabit,
      Habit,
      Achievement,
      HabitBadhabit,
      User,
    ]),
  ],
  exports: [MikroOrmModule],
})
export class EntityModule {}
