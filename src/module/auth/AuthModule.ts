import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserEntityModule } from '../../entity/domain/user/UserEntityModule';
import { AuthController } from './AuthController';
import { AuthRepository } from './AuthRepository';
import { AuthService } from './AuthService';

@Module({
  imports: [UserEntityModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
