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
    await orm.getSchemaGenerator().clearDatabase();
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

  describe('습관을 수정합니다.', () => {
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
      const updateRequest = Object.assign(
        new HabitUpdateRequest(),
        updateValues,
      );

      // NOTE : 참고용으로 둡니다.
      // plainToInstance를 사용하면 endedTime의 값이 startedTime으로 할당되는 문제가 있습니다.
      // const updateRequest = plainToInstance(HabitUpdateRequest, updateValues);

      // when
      await habitService.update(habit.id, user.id, updateRequest);

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

    it('습관을 수정할 때 새로운 부정습관을 추가할 수 있습니다.', async () => {
      // given
      const user = userFactory.makeOne();
      const habit = await habitFactory.createOne({
        user: Reference.create(user),
      });

      const badhabitName = '부정습관 이름';
      const updateRequest = plainToInstance(HabitUpdateRequest, {
        badhabits: [{ name: badhabitName }],
      });

      // when
      await habitService.update(habit.id, user.id, updateRequest);

      // then
      const foundHabit = await orm.em.find(Habit, {});
      const foundBadhabit = await orm.em.find(Badhabit, { name: badhabitName });
      const foundHabitBadhabit = await orm.em.find(HabitBadhabit, {});

      expect(foundHabit).toHaveLength(1);
      expect(foundBadhabit).toHaveLength(1);
      expect(foundHabitBadhabit).toHaveLength(1);
    });

    it('습관을 수정할 때 기존의 부정습관을 연결할 수 있습니다.', async () => {
      // given
      const user = userFactory.makeOne();
      const habit = habitFactory.makeOne({
        user: Reference.create(user),
      });
      const badhabit = await badhabitFactory.createOne({
        user: Reference.create(user),
      });

      const badHabitId = badhabit.id;
      const updateRequest = plainToInstance(HabitUpdateRequest, {
        badhabits: [{ id: badHabitId, name: '부정습관 이름' }],
      });

      // when
      await habitService.update(habit.id, user.id, updateRequest);

      // then
      const foundHabit = await orm.em.find(Habit, {});
      const foundBadhabit = await orm.em.find(Badhabit, {});
      const foundHabitBadhabit = await orm.em.find(HabitBadhabit, {
        habit: habit,
        badhabit: badhabit,
      });

      expect(foundHabit).toHaveLength(1);
      expect(foundBadhabit).toHaveLength(1);
      expect(foundHabitBadhabit).toHaveLength(1);
    });

    it('습관을 수정할 때 기존의 부정습관을 제거할 수 있습니다.', async () => {
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

      const updateRequest = plainToInstance(HabitUpdateRequest, {
        badhabits: [],
      });

      // when
      await habitService.update(habit.id, user.id, updateRequest);

      // then
      const foundHabit = await orm.em.find(Habit, {});
      const foundBadhabit = await orm.em.find(Badhabit, {});
      const foundHabitBadhabit = await orm.em.find(HabitBadhabit, {});

      expect(foundHabit).toHaveLength(1);
      expect(foundBadhabit).toHaveLength(1);
      expect(foundHabitBadhabit).toHaveLength(0);
    });
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

    it('특정 날에 달성해야 하는 습관을 조회합니다.', async () => {
      // given
      const user = userFactory.makeOne();
      const mondayDate = '2021-08-16'; // 월요일
      // 월요일 주기 습관
      habitFactory.makeOne({
        user: Reference.create(user),
        isAllDay: false,
        cycleWeek: false,
        cycleMonday: true,
      });
      // 월요일 주기가 아닌 습관
      habitFactory.makeOne({
        user: Reference.create(user),
        isAllDay: false,
        cycleWeek: false,
        cycleTuesday: true,
        cycleMonday: false,
      });
      // 하루종일 습관
      habitFactory.makeOne({
        user: Reference.create(user),
        isAllDay: true,
        cycleWeek: false,
      });
      // 주간 주기 습관
      await habitFactory.createOne({
        user: Reference.create(user),
        cycleWeek: true,
        isAllDay: false,
      });

      // when
      const habits = await habitService.findHabits({
        userId: user.id,
        date: mondayDate,
      });

      // then
      expect(habits).toHaveLength(3);
    });

    it('습관을 조회할 때 달성 기록과 함께 조회합니다.', async () => {
      // given
      const user = userFactory.makeOne();
      const habit = habitFactory.makeOne({
        user: Reference.create(user),
        isAllDay: true,
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
      const foundHabit = await habitService.findHabits({ userId: user.id });

      // then
      expect(foundHabit).toHaveLength(1);
      expect(foundHabit[0]?.achievement).toHaveLength(2);
    });

    it('개별 습관을 조회할 땐 과거 달성 기록도 포함하여 조회합니다.', async () => {
      // given
      const user = userFactory.makeOne();
      const habit = habitFactory.makeOne({
        user: Reference.create(user),
        isAllDay: true,
      });
      achievementFactory.makeOne({
        habit: Reference.create(habit),
        user: Reference.create(user),
      });
      achievementFactory.makeOne({
        habit: Reference.create(habit),
        user: Reference.create(user),
        createdAt: LocalDateTime.now().minusDays(2),
      });
      await achievementFactory.createOne({
        habit: Reference.create(habit),
        user: Reference.create(user),
        createdAt: LocalDateTime.now().minusDays(1),
      });

      // when
      const foundHabit = await habitService.findOneHabit(habit.id, user.id);

      // then
      expect(foundHabit).not.toBeFalsy();
      expect(foundHabit?.achievement).toHaveLength(3);
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
      const foundHabit = await habitService.findOneHabit(habit.id, user.id);

      // then
      expect(foundHabit).not.toBeFalsy();
      expect(foundHabit?.habitBadhabit).toHaveLength(1);
    });
  });
});
