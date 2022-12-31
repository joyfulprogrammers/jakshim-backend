import { Test, TestingModule } from '@nestjs/testing';

import { HabitService } from '../../../src/module/habit/HabitService';
import { getSqliteMikroOrmModule } from '../../getSqliteMikroOrmModule';
import { MikroORM } from '@mikro-orm/postgresql';
import { HabitEntityModule } from '../../../src/entity/domain/habit/HabitEntityModule';
import { HabitQueryRepository } from '../../../src/module/habit/HabitQueryRepository';
import { UserEntityModule } from '../../../src/entity/domain/user/UserEntityModule';

describe('HabitService', () => {
  let orm: MikroORM;
  let habitService: HabitService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [getSqliteMikroOrmModule(), UserEntityModule, HabitEntityModule],
      providers: [HabitService, HabitQueryRepository],
    }).compile();

    orm = module.get(MikroORM);
    await orm.getSchemaGenerator().refreshDatabase();
    habitService = module.get(HabitService);
  });

  afterAll(() => {
    void orm.close(true);
  });

  beforeEach(() => {
    void Promise.all([orm.getSchemaGenerator().clearDatabase()]);
  });

  it('습관을 생성합니다.', async () => {
    await habitService.createHabit();
  });
});
