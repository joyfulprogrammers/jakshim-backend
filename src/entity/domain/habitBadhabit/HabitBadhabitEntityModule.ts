import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, forwardRef } from '@nestjs/common';
import { UserEntityModule } from '../user/UserEntityModule';
import { HabitEntityModule } from '../habit/HabitEntityModule';

@Module({
  imports: [
    forwardRef(() => UserEntityModule),
    forwardRef(() => HabitEntityModule),
  ],
  exports: [MikroOrmModule],
})
export class HabitBadhabitEntityModule {}
