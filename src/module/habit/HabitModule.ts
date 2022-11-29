import { Module } from '@nestjs/common';
import { HabitController } from './HabitController';
import { HabitRepository } from './HabitRepository';
import { HabitService } from './HabitService';

@Module({
  imports: [],
  controllers: [HabitController],
  providers: [HabitService, HabitRepository],
})
export class HabitModule {}
