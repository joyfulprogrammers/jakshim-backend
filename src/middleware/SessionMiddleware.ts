import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { SessionOptionModule } from '../module/session/SessionOptionModule';
import { NextFunction, Request, Response } from 'express';
import * as session from 'express-session';
import { SessionConstant } from '../constant/SessionConstant';
import { Redis } from 'ioredis';
import * as connectRedis from 'connect-redis';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(
    @Inject(SessionConstant.REDIS) private readonly redis: Redis,
    @Inject(SessionConstant.SESSION_OPTION)
    private readonly sessionOptions: SessionOptionModule,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    session({
      ...this.sessionStoreOption(),
      ...this.sessionOptions.default(),
      ...this.sessionOptions.generateSessionId(),
    } as session.SessionOptions)(req, res, next);
  }

  private sessionStoreOption() {
    const RedisStore = connectRedis(session);

    return {
      store: new RedisStore({
        client: this.redis,
        logErrors: true,
      }),
    };
  }
}
