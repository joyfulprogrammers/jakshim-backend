import { Test, TestingModule } from '@nestjs/testing';

import { HabitService } from '../../../src/module/habit/HabitService';
import { HabitModule } from '../../../src/module/habit/HabitModule';
import { getSqliteMikroOrmModule } from '../../getSqliteMikroOrmModule';
import { MikroORM } from '@mikro-orm/postgresql';

describe('HabitService', () => {
  let orm: MikroORM;
  let habitService: HabitService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [getSqliteMikroOrmModule(), HabitModule],
      providers: [HabitService],
    }).compile();

    orm = module.get(MikroORM);
  });

  afterAll(() => {
    orm.close();
  });

  it('', () => {
    //
  });
});
