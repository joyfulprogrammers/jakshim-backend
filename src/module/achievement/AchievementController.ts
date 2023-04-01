import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from '../auth/guard/LoggedInGuard';
import { AchievementService } from './AchievementService';
import { Session } from '../../decorator/Session';

@ApiTags('ACHIEVEMENT')
@UseGuards(LoggedInGuard)
@Controller('api/achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post('/increase')
  @ApiCookieAuth()
  @ApiOperation({
    summary: '습관 달성',
    description: '습관을 달성합니다.',
  })
  async increaseAchievement(@Session() user) {}
}
