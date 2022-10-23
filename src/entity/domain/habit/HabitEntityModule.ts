import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Habit } from './Habit.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Habit])],
  exports: [MikroOrmModule],
})
export class HabitEntityModule {}
