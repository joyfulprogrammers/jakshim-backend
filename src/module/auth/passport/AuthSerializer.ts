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
    console.log('AuthSerializer.serializeUser', authSessionDto);
    done(null, instanceToPlain(authSessionDto));
  }

  deserializeUser(
    authSessionDto: AuthSessionDto,
    done: (err: Error | null, user: any) => void,
  ) {
    console.log('AuthSerializer.deserializeUser', authSessionDto);
    done(null, plainToInstance(AuthSessionDto, authSessionDto));
  }
}
