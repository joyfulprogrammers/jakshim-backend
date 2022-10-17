import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from '../../../ex-custom-repository/typeorm-ex.module';
import { User } from './User.entity';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([User])],
  exports: [TypeOrmModule],
})
export class UserModule {}
