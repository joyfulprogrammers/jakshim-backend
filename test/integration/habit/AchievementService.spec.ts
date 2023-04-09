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
import { HabitApiModule } from 'src/module/habit/HabitApiModule';
import { HabitService } from 'src/module/habit/HabitService';
import { AchievementEntityModule } from 'src/entity/domain/achievement/AchievementEntityModule';
import { HabitQueryRepository } from 'src/module/habit/HabitQueryRepository';
import { HabitEntityModule } from 'src/entity/domain/habit/HabitEntityModule';

describe('AchievementService', () => {
  let orm: MikroORM;
  let achievementService: AchievementService;
  let userFactory: UserFactory;
  let habitFactory: HabitFactory;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        getSqliteMikroOrmModule(),
        HabitApiModule,
        AchievementEntityModule,
        HabitEntityModule,
      ],
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
      const habit = await habitFactory.createOne({
        user: Reference.create(user),
      });
      const request = plainToInstance(AchievementRequest, {
        habitId: habit.id,
      });

      // when
      await achievementService.achieve(user.id, request.habitId);

      // then
      const achievement = await orm.em.find(Achievement, {});
      expect(achievement).toHaveLength(1);
      expect(achievement[0]).toEqual(expect.objectContaining({ count: 1 }));
    });
  });
});
