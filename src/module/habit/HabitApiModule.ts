import { Module } from '@nestjs/common';
import { HabitApiController } from './HabitApiController';
import { HabitApiRepository } from './HabitApiRepository';
import { HabitApiService } from './HabitApiService';

@Module({
  imports: [],
  controllers: [HabitApiController],
  providers: [HabitApiService, HabitApiRepository],
})
export class HabitApiModule {}
