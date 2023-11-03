import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Habit } from '../../entity/domain/habit/Habit.entity';
import { Achievement } from '../../entity/domain/achievement/Achievement.entity';
import { DateTimeUtil } from 'src/entity/util/DateTimeUtil';
import { LocalDate } from '@js-joda/core';

@Injectable()
export class AchievementQueryRepository {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: EntityRepository<Achievement>,
  ) {}

  async findTodayAchievementByHabitId(
    habitId: number,
    now = LocalDate.now(),
  ): Promise<Achievement | null> {
    const today = DateTimeUtil.getTodayMin(now);
    const tomorrow = today.plusDays(1);

    return this.achievementRepository.findOne({
      habit: {
        id: habitId,
      },
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });
  }

  async findTodayAchievementsByHabitId(
    habitId: number,
  ): Promise<Achievement[]> {
    const habit = plainToInstance(Habit, { id: habitId });
    const today = DateTimeUtil.getTodayMin();
    const tommorow = today.plusDays(1);

    return this.achievementRepository.find({
      habit,
      createdAt: {
        $gte: today,
        $lt: tommorow,
      },
    });
  }
}
