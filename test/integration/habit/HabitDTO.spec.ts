import { Test, TestingModule } from '@nestjs/testing';

import { HabitService } from 'src/module/habit/HabitService';
import { getSqliteMikroOrmModule } from '../../getSqliteMikroOrmModule';
import { MikroORM, Reference } from '@mikro-orm/core';
import { HabitEntityModule } from 'src/entity/domain/habit/HabitEntityModule';
import { HabitQueryRepository } from 'src/module/habit/HabitQueryRepository';
import { UserEntityModule } from 'src/entity/domain/user/UserEntityModule';
import { TransactionService } from 'src/entity/transaction/TransactionService';
import { BadhabitEntityModule } from 'src/entity/domain/badhabit/BadhabitEntityModule';
import { HabitBadhabitEntityModule } from 'src/entity/domain/habitBadhabit/HabitBadhabitEntityModule';
import { HabitFactory } from 'test/factory/HabitFactory';
import { UserFactory } from 'test/factory/UserFactory';
import { LocalDateTime } from '@js-joda/core';
import { AchievementFactory } from 'test/factory/AchievementFactory';
import { AchievementEntityModule } from 'src/entity/domain/achievement/AchievementEntityModule';
import { faker } from '@mikro-orm/seeder';
import { HabitFindResponse } from 'src/module/habit/dto/HabitFindResponse';
import { AchievementQueryRepository } from 'src/module/achievement/AchievementQueryRepository';

describe('HabitService', () => {
  let orm: MikroORM;
  let userFactory: UserFactory;
  let achievementFactory: AchievementFactory;
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
      providers: [
        HabitService,
        HabitQueryRepository,
        AchievementQueryRepository,
        TransactionService,
      ],
    }).compile();

    orm = module.get(MikroORM);
    const em = orm.em.fork();
    await orm.getSchemaGenerator().refreshDatabase();

    userFactory = new UserFactory(em);
    achievementFactory = new AchievementFactory(em);
    habitFactory = new HabitFactory(em);
    habitService = module.get(HabitService);
  });

  afterAll(() => {
    void orm.close(true);
  });

  beforeEach(async () => {
    await orm.getSchemaGenerator().clearDatabase();
  });

  describe('HabitFindResponse', () => {
    it('', async () => {
      // given
      const targetCount = faker.datatype.number({ min: 3, max: 100000 });
      const count = faker.datatype.number({ min: 0, max: targetCount });
      const user = userFactory.makeOne();
      const habit = habitFactory.makeOne({
        user: Reference.create(user),
        isAllDay: true,
        targetCount,
      });

      achievementFactory.makeOne({
        habit: Reference.create(habit),
        user: Reference.create(user),
        createdAt: LocalDateTime.now().minusDays(2),
        targetCount: targetCount - 1,
        count: count + 1,
      });
      achievementFactory.makeOne({
        habit: Reference.create(habit),
        user: Reference.create(user),
        targetCount,
        count,
      });
      await achievementFactory.createOne({
        habit: Reference.create(habit),
        user: Reference.create(user),
        createdAt: LocalDateTime.now().minusDays(1),
        targetCount: targetCount + 1,
        count: count - 1,
      });

      // when
      const foundHabit = await habitService.findOneHabit(habit.id, user.id);
      const response = new HabitFindResponse(foundHabit!);

      // then
      expect(response.habit.achievementCount).toBe(count);
      expect(response.habit.achievementTargetCount).toBe(targetCount);
      expect(response.habit.achievements).toHaveLength(3);
    });
  });
});
