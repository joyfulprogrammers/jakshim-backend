import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { HabitEntityModule } from '../habit/HabitEntityModule';
import { UserEntityModule } from '../user/UserEntityModule';
import { Achievement } from './Achievement.entity';

@Module({
  imports: [
    forwardRef(() => UserEntityModule),
    forwardRef(() => HabitEntityModule),
    MikroOrmModule.forFeature([Achievement]),
  ],
  exports: [MikroOrmModule],
})
export class AchievementEntityModule {}
