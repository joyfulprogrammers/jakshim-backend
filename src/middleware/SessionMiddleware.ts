import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { SessionOptionModule } from '../module/session/SessionOptionModule';
import { NextFunction, Request, Response } from 'express';
import * as session from 'express-session';
import * as RedisStore from 'connect-redis';
import { RedisClientType } from 'redis';
import { SessionConstant } from '../constant/SessionConstant';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(
    @Inject(SessionConstant.REDIS) private readonly redis: RedisClientType,
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

  private sessionStoreOption(): { store: session.Store } {
    return {
      store: new (RedisStore(session))({
        client: this.redis,
        logErrors: true,
      }),
    };
  }
}
