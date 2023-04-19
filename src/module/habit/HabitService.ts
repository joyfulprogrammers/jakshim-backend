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
import { Badhabit } from 'src/entity/domain/badhabit/Badhabit.entity';
import { HabitBadhabit } from 'src/entity/domain/habitBadhabit/HabitBadhabit.entity';

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

    const hasBadhabits = request.badhabits?.length > 0;

    const badhabitsHaveToBeCreated = hasBadhabits
      ? request.badhabits
          .filter((badhabit) => !badhabit.id)
          .map((badhabit) => Badhabit.create(userId, badhabit.name))
      : [];
    const badhabitsAlreadyExist = hasBadhabits
      ? request.badhabits.filter((badhabit) => !!badhabit.id)
      : [];

    await this.transactionService.transactional(async (manager) => {
      let badhabits = [];
      if (hasBadhabits) {
        badhabitsHaveToBeCreated.map((badhabit) => manager.persist(badhabit));
        badhabits = [...badhabitsHaveToBeCreated, ...badhabitsAlreadyExist];
      }

      await manager.persistAndFlush(newHabit);

      if (hasBadhabits) {
        badhabits.map((badhabit) => {
          manager.persist(HabitBadhabit.create(newHabit.id, badhabit.id));
        });

        await manager.flush();
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
}
