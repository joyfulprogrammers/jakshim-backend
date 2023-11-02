import { Controller, Get, HttpStatus, INestApplication } from '@nestjs/common';
import { StubLogger } from '../../logger/StubLogger';
import { Test, TestingModule } from '@nestjs/testing';
import { getTestLogger } from '../../logger/getTestLogger';
import { DomainExceptionFilter } from '../../../../src/libs/web-common/filter/DomainExceptionFilter';
import { DomainException } from '../../../../src/libs/exception/DomainException';
import * as request from 'supertest';
import { Logger } from 'src/libs/logger/Logger';

describe('DomainExceptionFilter', () => {
  let app: INestApplication;
  let logger: StubLogger;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [getTestLogger()],
      controllers: [TestController],
    }).compile();

    app = module.createNestApplication();
    logger = app.get(Logger);

    app.useGlobalFilters(new DomainExceptionFilter(logger));
    await app.init();
  });

  beforeEach(() => {
    logger.clear();
  });

  afterAll(async () => await app.close());

  it('domain Exception 발생시 필터가 작동한다.', async () => {
    //  given & when
    const response = await request(app.getHttpServer()).get(
      `/test/domain-exception`,
    );

    // then
    expect(response.body.statusCode).toBe(HttpStatus[HttpStatus.NOT_FOUND]);
    expect(response.body.message).toBe('domain-exception');
    expect(logger.logLevel).toBe('info');
  });
});

@Controller('/test')
class TestController {
  @Get('/domain-exception')
  domainException() {
    throw DomainException.NotFound({
      message: 'domain-exception',
    });
  }
}
