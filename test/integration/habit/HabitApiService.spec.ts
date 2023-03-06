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
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { HabitUpdateRequest } from '../../../src/module/habit/dto/HabitUpdateRequest';

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

  beforeEach(async () => {
    await Promise.all([orm.getSchemaGenerator().clearDatabase()]);
  });

  it('습관을 정상적으로 생성합니다.', async () => {
    // given
    const request = plainToInstance(HabitCreateRequest, {
      name: 'test',
      targetCount: 1,
      startedAt: new Date(), // LocalDateTime.now() 으로 하면 'date must be an instance of LocalDate'과 같은 에러 발생
      isAllDay: true,
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
    await habitService.createHabit(request, 1);

    // then
    const habit = await orm.em.find(Habit, {});
    expect(habit).toHaveLength(1);
  });

  it('필수 값을 입력하지 않으면 에러를 반환합니다.', async () => {
    // given
    const request = plainToInstance(HabitCreateRequest, {
      targetCount: 1,
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
    await expect(habitService.createHabit(request, 1)).rejects.toThrowError();
  });

  it('습관을 정상적으로 수정합니다.', async () => {
    // given
    const userId = 1;
    const createRequest = plainToInstance(HabitCreateRequest, {
      name: 'test',
      targetCount: 1,
      startedAt: new Date(),
      isAllDay: true,
      cycleMonday: true,
      cycleTuesday: true,
      cycleWednesday: true,
      cycleThursday: true,
      cycleFriday: true,
      cycleSaturday: true,
      cycleSunday: true,
      cycleWeek: false,
    });
    await habitService.createHabit(createRequest, userId);
    const foundCreatedHabit = await orm.em.find(Habit, {});
    const foundOldHabit = foundCreatedHabit[0];

    const updateValues = {
      name: 'foo',
      targetCount: 2,
      isAllDay: false,
    };
    const updateRequest = plainToInstance(HabitUpdateRequest, updateValues);

    // when
    await habitService.update(foundOldHabit.id, updateRequest, userId);

    // then
    const foundHabit = await orm.em.find(Habit, {});
    const habit = foundHabit[0];
    expect(habit).toEqual(
      expect.objectContaining({
        ...instanceToPlain(foundOldHabit),
        ...updateValues,
      }),
    );
  });
});
