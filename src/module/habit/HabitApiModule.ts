import { Module } from '@nestjs/common';
import { TransactionService } from '../../entity/transaction/TransactionService';
import { HabitController } from './HabitController';
import { HabitService } from './HabitService';
import { HabitQueryRepository } from './HabitQueryRepository';
import { HabitEntityModule } from '../../entity/domain/habit/HabitEntityModule';
import { AchievementEntityModule } from 'src/entity/domain/achievement/AchievementEntityModule';
import { AchievementQueryRepository } from '../achievement/AchievementQueryRepository';

@Module({
  imports: [HabitEntityModule, AchievementEntityModule],
  controllers: [HabitController],
  providers: [
    HabitService,
    HabitQueryRepository,
    AchievementQueryRepository,
    TransactionService,
  ],
})
export class HabitApiModule {}
