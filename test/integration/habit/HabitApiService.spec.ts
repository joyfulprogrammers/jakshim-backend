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
import { DateTimeUtil } from 'src/entity/util/DateTimeUtil';
import { LocalDateTime } from '@js-joda/core';
import { AchievementFactory } from 'test/factory/AchievementFactory';
import { AchievementEntityModule } from 'src/entity/domain/achievement/AchievementEntityModule';
import { BadhabitFactory } from 'test/factory/BadhabitFactory';
import { HabitBadhabitFactory } from 'test/factory/HabitBadhabitFactory';

describe('HabitService', () => {
  let orm: MikroORM;
  let userFactory: UserFactory;
  let achievementFactory: AchievementFactory;
  let badhabitFactory: BadhabitFactory;
  let habitBadhabitFactory: HabitBadhabitFactory;
  let habitFactory: HabitFactory;
  let habitService: HabitService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        getSqliteMikroOrmModule(),
        UserEntityModule,
        HabitEntityModule,
        AchievementEntityModule,
        BadhabitEntityModule,
        HabitBadhabitEntityModule,
      ],
      providers: [HabitService, HabitQueryRepository, TransactionService],
    }).compile();

    orm = module.get(MikroORM);
    const em = orm.em.fork();
    await orm.getSchemaGenerator().refreshDatabase();

    userFactory = new UserFactory(em);
    achievementFactory = new AchievementFactory(em);
    badhabitFactory = new BadhabitFactory(em);
    habitBadhabitFactory = new HabitBadhabitFactory(em);
    habitFactory = new HabitFactory(em);
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
    const habit = await habitFactory.createOne({
      user: Reference.create(user),
    });

    const updateValues: Partial<Habit> = {
      name: 'foo',
      startedTime: DateTimeUtil.toLocalTimeBy('15:00') || undefined,
      endedTime: DateTimeUtil.toLocalTimeBy('18:00') || undefined,
      targetCount: 2,
      isAllDay: false,
    };
    const updateRequest = Object.assign(new HabitUpdateRequest(), updateValues);

    // NOTE : 참고용으로 둡니다.
    // plainToInstance를 사용하면 endedTime의 값이 startedTime으로 할당되는 문제가 있습니다.
    // const updateRequest = plainToInstance(HabitUpdateRequest, updateValues);

    // when
    await habitService.update(habit.id, updateRequest, user.id);

    // then
    const foundHabit = await orm.em.find(Habit, {});
    expect(foundHabit[0]).toEqual(
      expect.objectContaining({
        // NOTE : 아래와 같이 실행하면 순환 참조로 인해 에러가 발생합니다.
        // ...instanceToPlain(habit),
        ...updateValues,
      }),
    );
  });

  describe('습관을 조회합니다.', () => {
    it('사용자의 모든 습관을 조회합니다.', async () => {
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

    it('삭제된 습관은 조회하지 않습니다.', async () => {
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
        deletedAt: LocalDateTime.now(),
      });

      // when
      const habits = await habitService.findAllByUser(user.id);

      // then
      expect(habits).toHaveLength(2);
    });

    // NOTE : 테스트 실행마다 성공하기도 하고 실패하기도 합니다.
    // 테스트 실행 순서에 따라 성공과 실패가 결정되는 것 같습니다.
    it.skip('특정 날에 달성해야 하는 습관을 조회합니다.', async () => {
      // given
      const user = userFactory.makeOne();
      const mondayDate = '2021-08-16'; // 월요일
      habitFactory.makeOne({
        user: Reference.create(user),
        cycleMonday: true,
      });
      habitFactory.makeOne({
        user: Reference.create(user),
        cycleTuesday: true,
      });
      habitFactory.makeOne({
        user: Reference.create(user),
        isAllDay: true,
      });
      await habitFactory.createOne({
        user: Reference.create(user),
        cycleWeek: true,
      });

      // when
      const habits = await habitService.findHabits({ date: mondayDate });

      // then
      expect(habits).toHaveLength(3);
    });

    it('습관을 조회할 때 달성 기록과 함께 조회합니다.', async () => {
      // given
      const user = userFactory.makeOne();
      const habit = await habitFactory.createOne({
        user: Reference.create(user),
      });
      achievementFactory.makeOne({
        habit: Reference.create(habit),
        user: Reference.create(user),
      });
      await achievementFactory.createOne({
        habit: Reference.create(habit),
        user: Reference.create(user),
      });

      // when
      const foundHabit = await habitService.findOneByHabitAndUser(
        habit.id,
        user.id,
      );

      // then
      expect(foundHabit).not.toBeFalsy();
      expect(foundHabit?.achievement).toHaveLength(2);
    });

    it('습관을 조회할 때 부정습관과 함께 조회합니다.', async () => {
      // given
      const user = userFactory.makeOne();
      const habit = habitFactory.makeOne({
        user: Reference.create(user),
      });
      const badhabit = badhabitFactory.makeOne({
        user: Reference.create(user),
      });

      await habitBadhabitFactory.createOne({
        habit: Reference.create(habit),
        badhabit: Reference.create(badhabit),
      });

      // when
      const foundHabit = await habitService.findOneByHabitAndUser(
        habit.id,
        user.id,
      );

      // then
      expect(foundHabit).not.toBeFalsy();
      expect(foundHabit?.habitBadhabit).toHaveLength(1);
    });
  });
});
