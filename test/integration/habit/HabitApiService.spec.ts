import { Test, TestingModule } from '@nestjs/testing';

import { HabitService } from '../../../src/module/habit/HabitService';
import { HabitApiModule } from '../../../src/module/habit/HabitApiModule';
import { getSqliteMikroOrmModule } from '../../getSqliteMikroOrmModule';
import { Habit } from '../../../src/entity/domain/habit/Habit.entity';
import { MikroORM } from '@mikro-orm/postgresql';

describe('HabitService', () => {
  let orm: MikroORM;
  let habitService: HabitService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [getSqliteMikroOrmModule(), HabitApiModule],
      providers: [HabitService],
    }).compile();

    orm = module.get(MikroORM);
  });

  afterAll(() => {
    void orm.close();
  });

  beforeEach(() => {
    void Promise.all([orm.getSchemaGenerator().clearDatabase()]);
  });

  it('습관을 생성합니다.', () => {
    //
  });
});
