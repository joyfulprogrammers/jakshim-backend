import { Test, TestingModule } from '@nestjs/testing';

import { HabitService } from '../../../src/module/habit/HabitService';
import { getSqliteMikroOrmModule } from '../../getSqliteMikroOrmModule';
import { MikroORM } from '@mikro-orm/core';
import { HabitEntityModule } from '../../../src/entity/domain/habit/HabitEntityModule';
import { HabitQueryRepository } from '../../../src/module/habit/HabitQueryRepository';
import { UserEntityModule } from '../../../src/entity/domain/user/UserEntityModule';
import { HabitCreateRequest } from '../../../src/module/habit/dto/HabitCreateRequest';
import { Habit } from '../../../src/entity/domain/habit/Habit.entity';
import { TransactionService } from '../../../src/entity/transaction/TransactionService';
import { plainToInstance } from 'class-transformer';

describe('HabitService', () => {
  let orm: MikroORM;
  let habitService: HabitService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [getSqliteMikroOrmModule(), UserEntityModule, HabitEntityModule],
      providers: [HabitService, HabitQueryRepository, TransactionService],
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

  it('습관을 정상적으로 생성합니다.', async () => {
    // given
    const request = plainToInstance(HabitCreateRequest, {
      name: 'test',
      themeColor: '#000000',
      fontColor: '#ffffff',
      iconImageUrl: 'https://test.com',
      targetCount: 1,
      type: 'POSITIVE',
      isImportant: true,
      cycleMonday: true,
      cycleTuesday: true,
      cycleWednesday: true,
      cycleThursday: true,
      cycleFriday: true,
      cycleSaturday: true,
      cycleSunday: true,
      cycleWeek: false,
    });

    // when
    await habitService.createHabit(request);

    // then
    const habit = await orm.em.find(Habit, {});
    expect(habit).not.toBeFalsy();
  });

  it('필수 값을 입력하지 않으면 에러를 반환합니다.', async () => {
    // given
    const request = plainToInstance(HabitCreateRequest, {
      themeColor: '#000000',
      fontColor: '#ffffff',
      iconImageUrl: 'https://test.com',
      targetCount: 1,
      type: 'POSITIVE',
      isImportant: true,
      cycleMonday: true,
      cycleTuesday: true,
      cycleWednesday: true,
      cycleThursday: true,
      cycleFriday: true,
      cycleSaturday: true,
      cycleSunday: true,
      cycleWeek: false,
    });

    // when
    await expect(habitService.createHabit(request)).rejects.toThrowError();
  });
});
