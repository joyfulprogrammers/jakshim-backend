import { Module } from '@nestjs/common';
import { TransactionService } from '../../entity/transaction/TransactionService';
import { HabitController } from './HabitController';
import { HabitQueryRepository } from './HabitQueryRepository';
import { HabitService } from './HabitService';

@Module({
  imports: [],
  controllers: [HabitController],
  providers: [HabitService, HabitQueryRepository, TransactionService],
})
export class HabitApiModule {}
