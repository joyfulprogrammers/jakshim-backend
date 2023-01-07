import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Habit } from '../../entity/domain/habit/Habit.entity';
import { HabitCreateRequest } from './dto/HabitCreateRequest';

@Injectable()
export class HabitQueryRepository {
  constructor(
    @InjectRepository(Habit)
    private readonly habitRepository: EntityRepository<Habit>,
  ) {}

  async create(req: HabitCreateRequest): Promise<void> {
    return Promise.resolve();
  }
}
