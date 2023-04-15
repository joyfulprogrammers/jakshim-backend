import { Module } from '@nestjs/common';
import { TransactionService } from '../../entity/transaction/TransactionService';
import { AchievementEntityModule } from '../../entity/domain/achievement/AchievementEntityModule';
import { AchievementController } from './AchievementController';
import { AchievementService } from './AchievementService';
import { AchievementQueryRepository } from './AchievementQueryRepository';
import { HabitApiModule } from '../habit/HabitApiModule';
import { HabitService } from '../habit/HabitService';
import { HabitQueryRepository } from '../habit/HabitQueryRepository';
import { HabitEntityModule } from 'src/entity/domain/habit/HabitEntityModule';

@Module({
  imports: [AchievementEntityModule, HabitApiModule, HabitEntityModule],
  controllers: [AchievementController],
  providers: [
    AchievementService,
    AchievementQueryRepository,

    HabitService,
    HabitQueryRepository,
    TransactionService,
  ],
})
export class AchievementApiModule {}
