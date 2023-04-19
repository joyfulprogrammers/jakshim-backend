import { Test, TestingModule } from '@nestjs/testing';

import { HabitService } from 'src/module/habit/HabitService';
import { getSqliteMikroOrmModule } from '../../getSqliteMikroOrmModule';
import { MikroORM, Reference } from '@mikro-orm/core';
import { HabitEntityModule } from 'src/entity/domain/habit/HabitEntityModule';
import { HabitQueryRepository } from 'src/module/habit/HabitQueryRepository';
import { UserEntityModule } from 'src/entity/domain/user/UserEntityModule';
import { HabitCreateRequest } from 'src/module/habit/dto/HabitCreateRequest';
import { Habit } from 'src/entity/domain/habit/Habit.entity';
import { TransactionService } from 'src/entity/transaction/TransactionService';
import { plainToInstance } from 'class-transformer';
import { HabitUpdateRequest } from 'src/module/habit/dto/HabitUpdateRequest';
import { BadhabitEntityModule } from 'src/entity/domain/badhabit/BadhabitEntityModule';
import { Badhabit } from 'src/entity/domain/badhabit/Badhabit.entity';
import { HabitBadhabit } from 'src/entity/domain/habitBadhabit/HabitBadhabit.entity';
import { HabitBadhabitEntityModule } from 'src/entity/domain/habitBadhabit/HabitBadhabitEntityModule';
import { HabitFactory } from 'test/factory/HabitFactory';
import { UserFactory } from 'test/factory/UserFactory';
import { HabitBadhabitFactory } from 'test/factory/HabitBadhabitFactory';
import { BadhabitFactory } from 'test/factory/BadhabitFactory';

describe('HabitService', () => {
  let orm: MikroORM;
  let userFactory: UserFactory;
  let habitFactory: HabitFactory;
  let habitBadhabitFactory: HabitBadhabitFactory;
  let badhabitFactory: BadhabitFactory;
  let habitService: HabitService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        getSqliteMikroOrmModule(),
        UserEntityModule,
        HabitEntityModule,
        BadhabitEntityModule,
        HabitBadhabitEntityModule,
      ],
      providers: [HabitService, HabitQueryRepository, TransactionService],
    }).compile();

    orm = module.get(MikroORM);
    const em = orm.em.fork();
    await orm.getSchemaGenerator().refreshDatabase();

    userFactory = new UserFactory(em);
    habitFactory = new HabitFactory(em);
    habitBadhabitFactory = new HabitBadhabitFactory(em);
    badhabitFactory = new BadhabitFactory(em);
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
      startedTime: '12:00', // LocalDateTime.now() 으로 하면 'date must be an instance of LocalDate'과 같은 에러 발생
      endedTime: '14:00',
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

  it('부정습관을 포함한 습관을 정상적으로 생성합니다.', async () => {
    // given
    const request = plainToInstance(HabitCreateRequest, {
      name: 'test',
      targetCount: 1,
      startedTime: '12:00',
      endedTime: '14:00',
      isAllDay: true,
      cycleMonday: true,
      cycleTuesday: true,
      cycleWednesday: true,
      cycleThursday: true,
      cycleFriday: true,
      cycleSaturday: true,
      cycleSunday: true,
      cycleWeek: false,
      badhabits: [{ name: 'test' }],
    });

    // when
    await habitService.createHabit(request, 1);

    // then
    const habit = await orm.em.find(Habit, {});
    const badhabit = await orm.em.find(Badhabit, {});
    const habitBadhabit = await orm.em.find(HabitBadhabit, {});

    expect(habit).toHaveLength(1);
    expect(badhabit).toHaveLength(1);
    expect(habitBadhabit).toHaveLength(1);
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
    const user = userFactory.makeOne();
    console.log('1');
    const habit = await habitFactory.createOne({
      user: Reference.create(user),
    });
    console.log('2');

    const updateValues: Partial<Habit> = {
      name: 'foo',
      startedTime: '15:00',
      endedTime: '18:00',
      targetCount: 2,
      isAllDay: false,
    };
    const updateRequest = plainToInstance(HabitUpdateRequest, updateValues);

    // when
    await habitService.update(habit.id, updateRequest, user.id);

    // then
    const foundHabit = await orm.em.find(Habit, {})[0];
    expect(foundHabit).toEqual(
      expect.objectContaining({
        ...instanceToPlain(habit),
        ...updateValues,
      }),
    );
  });

  describe('습관을 조회합니다.', () => {
    it('습관을 조회합니다.', async () => {
      // given
      const user = userFactory.makeOne();
      habitFactory.makeOne({
        user: Reference.create(user),
      });
      habitFactory.makeOne({
        user: Reference.create(user),
      });
      await habitFactory.createOne({
        user: Reference.create(user),
      });

      // when
      const habits = await habitService.findAllByUser(user.id);

      // then
      expect(habits).toHaveLength(3);
    });
  });
});
