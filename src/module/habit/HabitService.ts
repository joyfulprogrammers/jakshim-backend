import { Injectable } from '@nestjs/common';
import { Habit } from '../../entity/domain/habit/Habit.entity';
import { TransactionService } from '../../entity/transaction/TransactionService';
import { HabitCreateRequest } from './dto/HabitCreateRequest';

@Injectable()
export class HabitService {
  constructor(private readonly transactionService: TransactionService) {}

  async createHabit(request: HabitCreateRequest): Promise<void> {
    await this.transactionService.transactional(async (manager) => {
      const newHabit = Habit.create(
        1,
        request.name,
        request.type,
        request.targetCount,
        request.isImportant,
        request.cycleMonday,
        request.cycleTuesday,
        request.cycleWednesday,
        request.cycleThursday,
        request.cycleFriday,
        request.cycleSaturday,
        request.cycleSunday,
        request.cycleWeek,
        request.themeColor,
        request.fontColor,
        request.iconImageUrl,
      );
      await manager.persistAndFlush(newHabit);
    });
  }
}
