import { Module } from '@nestjs/common';
import { UserEntityModule } from '../../entity/domain/user/UserEntityModule';
import { UserRepository } from './UserRepository';
import { UserController } from './UserController';
import { UserService } from './UserService';

@Module({
  imports: [UserEntityModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
