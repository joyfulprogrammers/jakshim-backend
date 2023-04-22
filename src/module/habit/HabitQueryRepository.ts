import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Habit } from '../../entity/domain/habit/Habit.entity';

@Injectable()
export class HabitQueryRepository {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: EntityRepository<Habit>,
  ) {}

  async findOneByHabitAndUser(habitId: number, userId: number) {
    const habit = await this.habitRepository
      .createQueryBuilder('habit')
      .where({ 'habit.id': habitId, 'habit.user_id': userId })
      .getSingleResult();
    return habit;
  }

  async findAllByUser(userId: number) {
    return this.habitRepository.find({ user: { id: userId } });
  }
}
