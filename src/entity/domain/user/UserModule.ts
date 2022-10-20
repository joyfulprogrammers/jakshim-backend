import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from './User.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  exports: [MikroOrmModule],
})
export class UserEntityModule {}
