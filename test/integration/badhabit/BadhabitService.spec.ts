import { MikroORM } from '@mikro-orm/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Badhabit } from 'src/entity/domain/badhabit/Badhabit.entity';
import { TransactionService } from 'src/entity/transaction/TransactionService';
import { BadhabitService } from 'src/module/badhabit/BadhabitService';
import { getSqliteMikroOrmModule } from 'test/getSqliteMikroOrmModule';

describe('BadhabitService', () => {
  let orm: MikroORM;
  let badhabitService: BadhabitService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [getSqliteMikroOrmModule()],
      providers: [BadhabitService, TransactionService],
    }).compile();

    orm = module.get(MikroORM);
    await orm.getSchemaGenerator().refreshDatabase();

    badhabitService = module.get(BadhabitService);
  });

  afterAll(async () => {
    await orm.close(true);
  });

  beforeEach(async () => {
    await Promise.all([orm.getSchemaGenerator().clearDatabase()]);
  });

  it('부정습관을 정상적으로 생성합니다.', async () => {
    // given
    const userId = 1;
    const name = '부정습관';

    // when
    await badhabitService.create(userId, name);

    // then
    const badhabit = await orm.em.find(Badhabit, {});
    expect(badhabit).toHaveLength(1);
  });
});
