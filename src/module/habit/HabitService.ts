import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Habit } from '../../entity/domain/habit/Habit.entity';
import { TransactionService } from '../../entity/transaction/TransactionService';
import { HabitCreateRequest } from './dto/HabitCreateRequest';
import { HabitUpdateRequest } from './dto/HabitUpdateRequest';
import { HabitQueryRepository } from './HabitQueryRepository';
import { LocalDateTime } from '@js-joda/core';
import { HabitBadhabit } from '../../entity/domain/habitBadhabit/HabitBadhabit.entity';

@Injectable()
export class HabitService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly habitQueryRepository: HabitQueryRepository,
  ) {}

  async createHabit(
    request: HabitCreateRequest,
    userId: number,
  ): Promise<Habit> {
    const newHabit = request.toEntity(userId);

    await this.transactionService.transactional(async (manager) => {
      await manager.persistAndFlush(newHabit);

      if (!request.hasBadHabits) {
        return;
      }

      const createBadHabits = request.toBadHabitEntities(userId);
      await manager.persistAndFlush(createBadHabits);

      manager.persist(
        createBadHabits.map((badHabit) =>
          HabitBadhabit.create(newHabit.id, badHabit.id),
        ),
      );

      if (request.existedBadHabits.length) {
        manager.persist(
          request.existedBadHabits.map((badHabit) =>
            HabitBadhabit.create(newHabit.id, badHabit.id!),
          ),
        );
      }
    });

    return newHabit;
  }

  async update(id: number, request: HabitUpdateRequest, userId: number) {
    const habit = await this.habitQueryRepository.findOneByHabitAndUser(
      id,
      userId,
    );

    if (!habit) {
      throw new NotFoundException('습관이 존재하지 않습니다.');
    }

    if (habit.user?.id !== userId) {
      throw new ForbiddenException('권한이 없습니다');
    }

    habit.update(request);

    await this.transactionService.transactional(async (manager) => {
      await manager.persistAndFlush(habit);
    });

    return habit;
  }

  async delete(id: number, userId: number, now = LocalDateTime.now()) {
    const habit = await this.habitQueryRepository.findOneByHabitAndUser(
      id,
      userId,
    );

    if (!habit) {
      throw new NotFoundException('습관이 존재하지 않습니다');
    }

    if (habit.user?.id !== userId) {
      throw new ForbiddenException('권한이 없습니다');
    }

    await this.transactionService.transactional(async (manager) => {
      habit.delete(now);
      manager.persist(habit);
    });

    return habit;
  }

  async findOneByHabitAndUser(id: number, userId: number) {
    return this.habitQueryRepository.findOneByHabitAndUser(id, userId);
  }

  async findAllByUser(userId: number) {
    return this.habitQueryRepository.findAllByUser(userId);
  }

  async findHabits({ date }: { date?: string }) {
    return this.habitQueryRepository.findHabits({ date });
  }
}
