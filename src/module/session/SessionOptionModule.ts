import { DynamicModule } from '@nestjs/common';
import { Request } from 'express';
import { nanoid } from 'nanoid';
import { SessionOptions } from 'express-session';
import { SessionConstant } from '../../constant/SessionConstant';
import { ConfigService } from '@nestjs/config';

export class SessionOptionModule {
  private readonly _secret: string;
  private readonly _maxAge: number;
  private readonly _sessionIdLength = 25;

  constructor(secret: string, maxAge: number) {
    this._secret = secret;
    this._maxAge = maxAge;
  }

  static register(): DynamicModule {
    return {
      module: SessionOptionModule,
      providers: [
        {
          provide: SessionConstant.SESSION_OPTION,
          useFactory: (configService: ConfigService) =>
            new SessionOptionModule(
              configService.getOrThrow<string>('SESSION_SECRET'),
              configService.getOrThrow<number>('SESSION_MAX_AGE'),
            ),
          inject: [ConfigService],
        },
      ],
      exports: [SessionConstant.SESSION_OPTION],
    };
  }

  default(): Omit<SessionOptions, 'genid' | 'store'> {
    return {
      name: SessionConstant.SESSION_NAME,
      saveUninitialized: false,
      secret: this._secret,
      resave: false,
      cookie: {
        httpOnly: true,
        maxAge: this._maxAge,
      },
    };
  }

  generateSessionId(): { genid: (_req: Request) => string } {
    return {
      genid: (_req: Request) => nanoid(this._sessionIdLength),
    };
  }

  get sessionIdLength() {
    return this._sessionIdLength;
  }
}
