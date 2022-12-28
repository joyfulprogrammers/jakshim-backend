import { Module } from '@nestjs/common';
import { HabitController } from './HabitController';
import { HabitQueryRepository } from './HabitQueryRepository';
import { HabitService } from './HabitService';

@Module({
  imports: [],
  controllers: [HabitController],
  providers: [HabitService, HabitQueryRepository],
})
export class HabitApiModule {}
