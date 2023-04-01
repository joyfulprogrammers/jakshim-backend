import { Module } from '@nestjs/common';
import { TransactionService } from '../../entity/transaction/TransactionService';
import { AchievementEntityModule } from '../../entity/domain/achievement/AchievementEntityModule';
import { AchievementController } from './AchievementController';
import { AchievementService } from './AchievementService';
import { AchievementQueryRepository } from './AchievementQueryRepository';
import { HabitApiModule } from '../habit/HabitApiModule';

@Module({
  imports: [AchievementEntityModule, HabitApiModule],
  controllers: [AchievementController],
  providers: [
    AchievementService,
    AchievementQueryRepository,
    TransactionService,
  ],
})
export class AchievementApiModule {}
