import { LocalDate } from '@js-joda/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Habit } from 'src/entity/domain/habit/Habit.entity';
import { Achievement } from '../../entity/domain/achievement/Achievement.entity';

@Injectable()
export class AchievementQueryRepository {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: EntityRepository<Achievement>,
  ) {}

  async findTodayAchievementByHabitId(
    habitId: number,
  ): Promise<Achievement | null> {
    const habit = plainToInstance(Habit, { id: habitId });
    const today = LocalDate.now().atStartOfDay();
    const tommorow = today.plusDays(1);

    return this.achievementRepository.findOne({
      habit,
      createdAt: {
        $gte: today,
        $lt: tommorow,
      },
    });
  }
}
