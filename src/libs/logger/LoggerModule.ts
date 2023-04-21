import { DynamicModule } from '@nestjs/common';
import { Logger } from './Logger';
import { createLogger } from 'winston';
import { getWinstonOption } from './getWinstonOption';

export class LoggerModule {
  static register(): DynamicModule {
    return {
      module: LoggerModule,
      global: true,
      providers: [
        {
          provide: Logger,
          useFactory: () => createLogger(getWinstonOption()),
        },
      ],
      exports: [Logger],
    };
  }
}
