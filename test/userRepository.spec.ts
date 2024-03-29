import { UserEntityModule } from 'src/entity/domain/user/UserEntityModule';

import { getPgTestMikroOrmModule } from './getPgTestMikroOrmModule';
import { UserRepository } from 'src/module/user/UserRepository';
import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';

describe.skip('', () => {
  let orm: MikroORM;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [getPgTestMikroOrmModule(), UserEntityModule],
      providers: [UserRepository],
    }).compile();

    orm = module.get(MikroORM);
    await orm.getSchemaGenerator().refreshDatabase();
  });

  afterAll(async () => orm.close(true));

  it('', () => {});
});
