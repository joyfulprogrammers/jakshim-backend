import { DynamicModule } from '@nestjs/common';
import { Logger } from 'src/libs/logger/Logger';
import { StubLogger } from './StubLogger';

export function getTestLogger(): DynamicModule {
  return TestLoggerModule.register();
}

class TestLoggerModule {
  static register(): DynamicModule {
    return {
      global: true,
      module: TestLoggerModule,
      providers: [
        {
          provide: Logger,
          useFactory: () => StubLogger.getInstance(),
        },
      ],
      exports: [Logger],
    };
  }
}
