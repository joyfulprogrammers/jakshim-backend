import { MikroORM } from '@mikro-orm/core';
import config from '../config/mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { AchievementEntityModule } from '../entity/domain/achievement/AchievementEntityModule';
import { HabitEntityModule } from '../entity/domain/habit/HabitEntityModule';
import { UserEntityModule } from '../entity/domain/user/UserEntityModule';

export const synchronizeEntities = async (): Promise<void> => {
  // MikroORM.init()을 사용하면, createSchema를 했을때 몇몇 엔티티가 누락되는 문제가 발생
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      MikroOrmModule.forRoot(config),
      UserEntityModule,
      HabitEntityModule,
      AchievementEntityModule,
    ],
  }).compile();

  const orm = module.get(MikroORM);
  const generator = orm.getSchemaGenerator();
  await generator.updateSchema({ safe: true });

  const migrator = orm.getMigrator();
  try {
    await migrator.createMigration();
    await migrator.up();
  } catch (error) {
    await migrator.down();
  }

  await orm.close(true);

  return;
};
