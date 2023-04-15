import { Module, forwardRef } from '@nestjs/common';
import { UserEntityModule } from '../user/UserEntityModule';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Badhabit } from './Badhabit.entity';

@Module({
  imports: [
    forwardRef(() => UserEntityModule),
    MikroOrmModule.forFeature([Badhabit]),
  ],
  exports: [MikroOrmModule],
})
export class BadhabitEntityModule {}
