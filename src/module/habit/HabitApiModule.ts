import { Module } from '@nestjs/common';
import { TransactionService } from '../../entity/transaction/TransactionService';
import { HabitController } from './HabitController';
import { HabitService } from './HabitService';

@Module({
  imports: [],
  controllers: [HabitController],
  providers: [HabitService, TransactionService],
})
export class HabitApiModule {}
