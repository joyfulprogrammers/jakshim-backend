import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { MikroORM, Reference } from '@mikro-orm/core';

import { AchievementService } from 'src/module/achievement/AchievementService';
import { getSqliteMikroOrmModule } from '../../getSqliteMikroOrmModule';
import { AchievementQueryRepository } from 'src/module/achievement/AchievementQueryRepository';
import { TransactionService } from 'src/entity/transaction/TransactionService';
import { UserFactory } from '../../factory/UserFactory';
import { HabitFactory } from '../../factory/HabitFactory';
import { AchievementRequest } from 'src/module/achievement/dto/AchievementRequest';
import { Achievement } from 'src/entity/domain/achievement/Achievement.entity';
import { HabitService } from 'src/module/habit/HabitService';
import { HabitQueryRepository } from 'src/module/habit/HabitQueryRepository';
import { AchievementFactory } from 'test/factory/AchievementFactory';
import { faker } from '@mikro-orm/seeder';
import { DateTimeUtil } from 'src/entity/util/DateTimeUtil';
import { EntityModule } from '../../../src/entity/domain/EntityModule';

describe('AchievementService', () => {
  let orm: MikroORM;
  let achievementService: AchievementService;
  let userFactory: UserFactory;
  let habitFactory: HabitFactory;
  let achievementFactory: AchievementFactory;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [getSqliteMikroOrmModule(), EntityModule],
      providers: [
        AchievementService,
        AchievementQueryRepository,
        HabitService,
        HabitQueryRepository,
        TransactionService,
      ],
    }).compile();

    orm = module.get(MikroORM);
    const em = orm.em.fork();
    await orm.getSchemaGenerator().refreshDatabase();

    userFactory = new UserFactory(em);
    habitFactory = new HabitFactory(em);
    achievementFactory = new AchievementFactory(em);
    achievementService = module.get(AchievementService);
  });

  afterAll(async () => {
    await orm.close(true);
  });

  beforeEach(async () => {
    await Promise.all([orm.getSchemaGenerator().clearDatabase()]);
  });

  describe('습관을 정상적으로 달성합니다.', () => {
    it('오늘 달성이 없다면 오늘 달성을 새로 만듭니다.', async () => {
      // given
      const user = userFactory.makeOne();
      const habit = habitFactory.makeOne({
        user: Reference.create(user),
      });
      const pastAchievement = await achievementFactory.createOne({
        habit: Reference.create(habit),
        user: Reference.create(user),
        createdAt: faker.date.past(),
      });
      const request = plainToInstance(AchievementRequest, {
        habitId: habit.id,
      });
      const pastAchievementCount = pastAchievement.count;

      // when
      await achievementService.achieve(user.id, request.habitId);

      // then
      const achievement = await orm.em.findOne(Achievement, {
        createdAt: {
          $gte: DateTimeUtil.getTodayMin(),
          $lt: DateTimeUtil.getTodayMin().plusDays(1),
        },
      });
      expect(achievement).not.toBeNull();
      expect(achievement).toEqual(expect.objectContaining({ count: 1 }));
      expect(pastAchievementCount).toBe(pastAchievement.count);
    });

    it('오늘 달성이 있다면 오늘 달성을 업데이트합니다.', async () => {
      // given
      const user = userFactory.makeOne();
      const habit = habitFactory.makeOne({
        user: Reference.create(user),
      });
      const todayAchievement = await achievementFactory.createOne({
        habit: Reference.create(habit),
        user: Reference.create(user),
        createdAt: new Date(),
      });
      const todayAchievementCount = todayAchievement.count;
      const request = plainToInstance(AchievementRequest, {
        habitId: habit.id,
      });

      // when
      await achievementService.achieve(user.id, request.habitId);

      // then
      const achievement = await orm.em.findOne(Achievement, {
        createdAt: {
          $gte: DateTimeUtil.getTodayMin(),
          $lt: DateTimeUtil.getTodayMin().plusDays(1),
        },
      });
      expect(achievement).not.toBeNull();
      expect(achievement).toEqual(
        expect.objectContaining({ count: todayAchievementCount + 1 }),
      );
    });
  });
});
