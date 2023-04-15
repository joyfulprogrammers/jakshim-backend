import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, forwardRef } from '@nestjs/common';
import { Habit } from './Habit.entity';
import { UserEntityModule } from '../user/UserEntityModule';

@Module({
  imports: [
    forwardRef(() => UserEntityModule),
    MikroOrmModule.forFeature([Habit]),
  ],
  exports: [MikroOrmModule],
})
export class HabitEntityModule {}
