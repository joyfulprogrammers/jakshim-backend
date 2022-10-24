import { UserEntityModule } from '../src/entity/domain/user/UserEntityModule';

import { getPgTestMikroOrmModule } from './getPgTestMikroOrmModule';
import { UserRepository } from '../src/module/user/repository/UserRepository';
import { Test, TestingModule } from '@nestjs/testing';
import { MikroORM } from '@mikro-orm/core';

describe('', () => {
  let userRepository: UserRepository;
  let orm: MikroORM;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [getPgTestMikroOrmModule(), UserEntityModule],
      providers: [UserRepository],
    }).compile();

    orm = module.get(MikroORM);
    await orm.getSchemaGenerator().refreshDatabase();
    userRepository = module.get(UserRepository);
  });

  afterAll(async () => orm.close(true));

  it('', async () => {
    await userRepository.save({ nickname: 'foo' });
  });
});
