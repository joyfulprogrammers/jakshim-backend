import { Injectable, NotFoundException } from '@nestjs/common';
import { Achievement } from '../../entity/domain/achievement/Achievement.entity';
import { TransactionService } from '../../entity/transaction/TransactionService';
import { HabitService } from '../habit/HabitService';
import { AchievementQueryRepository } from './AchievementQueryRepository';

@Injectable()
export class AchievementService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly habitService: HabitService,
    private readonly achievementQueryRepository: AchievementQueryRepository,
  ) {}

  async achieve(userId: number, habitId: number, countToAdd = 1) {
    const todayAchievement =
      await this.achievementQueryRepository.findTodayAchievementByHabitId(
        habitId,
      );

    if (todayAchievement) {
      const prevCount = todayAchievement.count;

      todayAchievement.update({ count: prevCount + countToAdd });

      await this.transactionService.transactional(async (manager) => {
        await manager.persistAndFlush(todayAchievement);
      });

      return todayAchievement;
    }

    const habit = await this.habitService.findOneHabit(habitId, userId);

    if (!habit) {
      throw new NotFoundException('습관이 존재하지 않습니다');
    }

    const newAchievement = Achievement.create(
      userId,
      habitId,
      habit.targetCount,
    );

    await this.transactionService.transactional(async (manager) => {
      await manager.persistAndFlush(newAchievement);
    });

    return newAchievement;
  }
}
