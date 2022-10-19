import { Module } from '@nestjs/common';
import { UserEntityModule } from '../../entity/domain/user/UserModule';
import { UserRepository } from './repository/UserRepository';
import { UserController } from './UserController';
import { UserService } from './UserService';

@Module({
  imports: [UserEntityModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
