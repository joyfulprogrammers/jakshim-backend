import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { AchievementEntityModule } from '../entity/domain/achievement/AchievementEntityModule';
import { HabitEntityModule } from '../entity/domain/habit/HabitEntityModule';
import { UserEntityModule } from '../entity/domain/user/UserEntityModule';
import config from '../config/mikro-orm.config';

export const synchronizeEntities = async (): Promise<void> => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      MikroOrmModule.forRoot(config),
      UserEntityModule,
      HabitEntityModule,
      AchievementEntityModule,
    ],
  }).compile();
  const orm = module.get(MikroORM);
  await orm.getSchemaGenerator().refreshDatabase();
  await orm.close(true);

  return;
};
