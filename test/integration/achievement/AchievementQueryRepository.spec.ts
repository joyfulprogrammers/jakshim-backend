import { Test } from '@nestjs/testing';
import { EntityModule } from '../../../src/entity/domain/EntityModule';
import { MikroORM, Reference } from '@mikro-orm/core';
import { AchievementQueryRepository } from '../../../src/module/achievement/AchievementQueryRepository';
import { AchievementFactory } from '../../factory/AchievementFactory';
import { HabitFactory } from '../../factory/HabitFactory';
import { LocalDateTime } from '@js-joda/core';
import { getSqliteMikroOrmModule } from '../../getSqliteMikroOrmModule';
import { User } from '../../../src/entity/domain/user/User.entity';
import { expectNonNullable } from '../../libs/web-common/expectNonNullable';

describe('AchievementQueryRepository', () => {
  let achievementQueryRepository: AchievementQueryRepository;
  let achievementFactory: AchievementFactory;
  let habitFactory: HabitFactory;
  let orm: MikroORM;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [getSqliteMikroOrmModule(), EntityModule],
      providers: [AchievementQueryRepository],
    }).compile();

    orm = module.get<MikroORM>(MikroORM);
    const em = orm.em.fork();
    await orm.getSchemaGenerator().refreshDatabase();
    achievementFactory = new AchievementFactory(em);
    habitFactory = new HabitFactory(em);
    achievementQueryRepository = module.get(AchievementQueryRepository);
  });

  beforeEach(async () => orm.getSchemaGenerator().clearDatabase());

  afterAll(async () => orm.close(true));

  describe('findTodayAchievementByHabitId', () => {
    it('오늘 습관에 대한 데이터가 없는 경우 null을 반환한다.', async () => {
      // given, when
      const result =
        await achievementQueryRepository.findTodayAchievementByHabitId(1);

      // then
      expect(result).toBeNull();
    });

    it('오늘 습관에 대한 달성 데이터를 조회한다.', async () => {
      // given
      const habit = habitFactory.makeOne({
        user: Reference.createFromPK(User, 1),
      });
      const now = LocalDateTime.of(2000, 1, 1);
      const achievement = await achievementFactory.createOne({
        habit: Reference.create(habit),
        user: Reference.createFromPK(User, 1),
        createdAt: now,
      });

      // when
      const result =
        await achievementQueryRepository.findTodayAchievementByHabitId(
          habit.id,
          now.toLocalDate(),
        );

      // then
      expectNonNullable(result);
      expect(result.id).toBe(achievement.id);
    });
  });
});
