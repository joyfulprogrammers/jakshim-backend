import { Injectable, NotFoundException } from '@nestjs/common';
import { Habit } from '../../entity/domain/habit/Habit.entity';
import { TransactionService } from '../../entity/transaction/TransactionService';
import { HabitCreateRequest } from './dto/HabitCreateRequest';
import { HabitUpdateRequest } from './dto/HabitUpdateRequest';
import { HabitQueryRepository } from './HabitQueryRepository';

@Injectable()
export class HabitService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly habitQueryRepository: HabitQueryRepository,
  ) {}

  async createHabit(request: HabitCreateRequest): Promise<Habit> {
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

    await this.transactionService.transactional(async (manager) => {
      await manager.persistAndFlush(newHabit);
    });

    return newHabit;
  }

  async update(id: number, request: HabitUpdateRequest) {
    const habit = await this.habitQueryRepository.findOneByHabitAndUser(
      id,
      request.userId,
    );

    if (!habit) {
      throw new NotFoundException('습관이 존재하지 않습니다.');
    }

    habit.update(request);

    await this.transactionService.transactional(async (manager) => {
      await manager.persistAndFlush(habit);
    });
  }
}
