import { Test, TestingModule } from '@nestjs/testing';

import { HabitApiService } from '../../../src/module/habit/HabitApiService';
import { HabitApiModule } from '../../../src/module/habit/HabitApiModule';
import { getSqliteMikroOrmModule } from '../../getSqliteMikroOrmModule';
import { Habit } from '../../../src/entity/domain/habit/Habit.entity';
import { MikroORM } from '@mikro-orm/postgresql';

describe('HabitService', () => {
  let orm: MikroORM;
  let habitService: HabitApiService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [getSqliteMikroOrmModule(), HabitApiModule],
      providers: [HabitApiService],
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
