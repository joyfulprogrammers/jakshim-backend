import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserEntityModule } from '../../entity/domain/user/UserEntityModule';
import { UserModule } from '../user/UserModule';
import { AuthController } from './AuthController';
import { AuthRepository } from './AuthRepository';
import { AuthService } from './AuthService';
import { AuthLocalStrategy } from './passport/AuthLocalStrategy';
import { AuthSerializer } from './passport/AuthSerializer';

@Module({
  imports: [
    UserEntityModule,
    PassportModule.register({ session: true }),

    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, AuthLocalStrategy, AuthSerializer],
})
export class AuthModule {}
