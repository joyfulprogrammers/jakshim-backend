import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, forwardRef } from '@nestjs/common';
import { UserEntityModule } from '../user/UserEntityModule';
import { HabitEntityModule } from '../habit/HabitEntityModule';
import { HabitBadhabit } from './HabitBadhabit.entity';

@Module({
  imports: [
    forwardRef(() => UserEntityModule),
    forwardRef(() => HabitEntityModule),
    MikroOrmModule.forFeature([HabitBadhabit]),
  ],
  exports: [MikroOrmModule],
})
export class HabitBadhabitEntityModule {}
