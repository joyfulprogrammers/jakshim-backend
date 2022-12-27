import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Habit } from '../../entity/domain/habit/Habit.entity';

@Injectable()
export class HabitApiRepository {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: EntityRepository<Habit>,
  ) {}
}
