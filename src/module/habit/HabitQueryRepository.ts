import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Habit } from '../../entity/domain/habit/Habit.entity';
import { LocalDate } from '@js-joda/core';
import { DateTimeUtil } from 'src/entity/util/DateTimeUtil';

@Injectable()
export class HabitQueryRepository {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: EntityRepository<Habit>,
  ) {}

  async findHabits({
    userId,
    date,
  }: {
    userId: number;
    date?: string;
  }): Promise<Habit[]> {
    const cycleConditions = Habit.getCycleOnDate(date);
    const targetDate = LocalDate.parse(
      date || DateTimeUtil.toString(LocalDate.now()),
    ).atStartOfDay();
    userId;
    cycleConditions;
    targetDate;
    const habits = await this.habitRepository
      .createQueryBuilder('habit')
      .select('*')
      .leftJoinAndSelect('habit.achievement', 'achievement')
      .leftJoinAndSelect('habit.habitBadhabit', 'habitBadhabit')
      .leftJoinAndSelect('habitBadhabit.badhabit', 'badhabit')
      .where({
        $and: [
          // NOTE : 질의 메인테이블(?)의 컬럼 이름은 스네이크 케이스로 작성해야 하고
          { 'habit.user_id': userId, 'habit.deleted_at': null },
          {
            $or: [
              // NODE : 조인 테이블의 컬럼 이름은 카멜 케이스로 작성해야 테스트를 통과한다.
              { 'achievement.createdAt': null },
              {
                'achievement.createdAt': {
                  $gte: targetDate,
                  $lt: targetDate.plusDays(1),
                },
              },
            ],
          },
        ],
        $or: [{ isAllDay: true }, { cycleWeek: true }, { ...cycleConditions }],
      });

    return habits;
  }

  async findOneByHabitAndUser(habitId: number, userId: number) {
    const habit = await this.habitRepository
      .createQueryBuilder('habit')
      .leftJoinAndSelect('habit.achievement', 'achievement')
      .leftJoinAndSelect('habit.habitBadhabit', 'habitBadhabit')
      .leftJoinAndSelect('habitBadhabit.badhabit', 'badhabit')
      .where({
        'habit.id': habitId,
        'habit.user_id': userId,
        'habit.deletedAt': null,
      })
      .getSingleResult();

    return habit;
  }

  async findAllByUser(userId: number) {
    return this.habitRepository.find({ user: { id: userId }, deletedAt: null });
  }
}
