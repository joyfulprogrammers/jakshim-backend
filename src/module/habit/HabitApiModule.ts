import { Module } from '@nestjs/common';
import { TransactionService } from '../../entity/transaction/TransactionService';
import { HabitController } from './HabitController';
import { HabitService } from './HabitService';
import { HabitQueryRepository } from './HabitQueryRepository';
import { HabitEntityModule } from '../../entity/domain/habit/HabitEntityModule';

@Module({
  imports: [HabitEntityModule],
  controllers: [HabitController],
  providers: [HabitService, HabitQueryRepository, TransactionService],
})
export class HabitApiModule {}
