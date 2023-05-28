import { ForbiddenException, Injectable } from '@nestjs/common';
import { Habit } from '../../entity/domain/habit/Habit.entity';
import { TransactionService } from '../../entity/transaction/TransactionService';
import { HabitCreateRequest } from './dto/HabitCreateRequest';
import { HabitUpdateRequest } from './dto/HabitUpdateRequest';
import { HabitQueryRepository } from './HabitQueryRepository';
import { LocalDateTime } from '@js-joda/core';
import { HabitBadhabit } from '../../entity/domain/habitBadhabit/HabitBadhabit.entity';
import { ErrorResponseStatus } from 'src/libs/res/ErrorResponseStatusResponseStatus';
import { ResponseStatus } from 'src/libs/res/ResponseStatus';

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
        return newHabit;
      }

      const newBadHabits = request.toBadHabitEntities(userId);
      await manager.persistAndFlush(newBadHabits);

      manager.persist(
        newBadHabits.map(
          (badHabit) => HabitBadhabit.create(newHabit.id, badHabit.id), // Habit과 Badhabit을 연결합니다.
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

  async update(habitId: number, userId: number, request: HabitUpdateRequest) {
    const habit = await this.habitQueryRepository.findOneHabit({
      habitId,
      userId,
    });

    if (!habit) {
      throw new ErrorResponseStatus(
        ResponseStatus.NOT_FOUND,
        `습관을 찾을 수 없습니다. 습관 아이디 : ${habitId}`,
      );
    }

    if (habit.user?.id !== userId) {
      throw new ForbiddenException('권한이 없습니다');
    }

    await this.transactionService.transactional(async (manager) => {
      const habitBadhabits = habit.habitBadhabit?.getItems() || [];

      // 부정습관을 제거하는 과정
      if (habitBadhabits.length > 0) {
        if (!request.hasBadHabits) {
          manager.remove(habitBadhabits);
        } else {
          const deleteBadHabits = habitBadhabits.filter(
            (habitBadhabit) =>
              !request.badhabits?.some(
                (badHabit) => badHabit.id === habitBadhabit.badhabit.id,
              ),
          );

          if (deleteBadHabits.length > 0) {
            manager.remove(deleteBadHabits);
          }
        }
      }

      // 부정습관을 연결하는 과정
      if (request.hasBadHabits) {
        const createBadHabits = request.toBadHabitEntities(userId);
        await manager.persistAndFlush(createBadHabits);

        manager.persist(
          createBadHabits.map((badHabit) =>
            HabitBadhabit.create(habit.id, badHabit.id),
          ),
        );

        if (request.existedBadHabits.length) {
          manager.persist(
            request.existedBadHabits.map((badHabit) =>
              HabitBadhabit.create(habit.id, badHabit.id!),
            ),
          );
        }
      }

      habit.update(request);
      manager.persist(habit);
    });

    return habit;
  }

  async delete(habitId: number, userId: number, now = LocalDateTime.now()) {
    const habit = await this.habitQueryRepository.findOneHabit({
      habitId,
      userId,
    });

    if (!habit) {
      throw new ErrorResponseStatus(
        ResponseStatus.NOT_FOUND,
        `습관을 찾을 수 없습니다. 습관 아이디 : ${habitId}`,
      );
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

  async findOneHabit(habitId: number, userId: number) {
    const habit = await this.habitQueryRepository.findOneHabit({
      habitId,
      userId,
    });

    if (!habit) {
      throw new ErrorResponseStatus(
        ResponseStatus.NOT_FOUND,
        `습관을 찾을 수 없습니다. 습관 아이디 : ${habitId}`,
      );
    }

    return habit;
  }

  async findAllByUser(userId: number) {
    return this.habitQueryRepository.findAllByUser(userId);
  }

  async findHabits({ userId, date }: { userId: number; date?: string }) {
    return this.habitQueryRepository.findHabits({ userId, date });
  }
}
