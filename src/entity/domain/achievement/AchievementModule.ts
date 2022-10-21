import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Achievement } from './Achievement.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Achievement])],
  exports: [MikroOrmModule],
})
export class AchievementEntityModule {}
