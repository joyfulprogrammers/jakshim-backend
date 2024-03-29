import { PassportSerializer } from '@nestjs/passport';
import { AuthSessionDto } from '../dto/AuthSessionDto';
import { Injectable } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor() {
    super();
  }

  serializeUser(
    authSessionDto: AuthSessionDto,
    done: (err: Error | null, authSessionDto: any) => void,
  ) {
    done(null, instanceToPlain(authSessionDto));
  }

  deserializeUser(
    authSessionDto: AuthSessionDto,
    done: (err: Error | null, user: any) => void,
  ) {
    done(null, plainToInstance(AuthSessionDto, authSessionDto));
  }
}
