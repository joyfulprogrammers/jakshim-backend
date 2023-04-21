import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from '../auth/guard/LoggedInGuard';
import { AchievementService } from './AchievementService';
import { Session } from '../../decorator/Session';
import { AchievementRequest } from './dto/AchievementRequest';
import { ResponseEntity } from '../../libs/res/ResponseEntity';
import { ResponseStatus } from '../../libs/res/ResponseStatus';
import { AuthSessionDto } from '../auth/dto/AuthSessionDto';

@ApiTags('ACHIEVEMENT')
@UseGuards(LoggedInGuard)
@Controller('api/achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post('/achieve')
  @ApiCookieAuth()
  @ApiOperation({
    summary: '습관 달성 API',
    description: '습관을 달성합니다.',
  })
  async achieve(
    @Body() request: AchievementRequest,
    @Session() user: AuthSessionDto,
  ) {
    try {
      await this.achievementService.achieve(user.id, request.habitId);

      return ResponseEntity.OK();
    } catch (error) {
      let errorCode: ResponseStatus;

      if (error instanceof BadRequestException) {
        errorCode = ResponseStatus.BAD_REQUEST;
      } else {
        // eslint-disable-next-line no-console
        console.error(`습관 달성 실패`, error);
        errorCode = ResponseStatus.SERVER_ERROR;
      }

      return ResponseEntity.ERROR_WITH(error.message, errorCode);
    }
  }

  @Post('/unachieve')
  @ApiCookieAuth()
  @ApiOperation({
    summary: '습관 달성 취소 API',
    description: '습관을 달성 취소합니다.',
  })
  async unachieve(
    @Body() request: AchievementRequest,
    @Session() user: AuthSessionDto,
  ) {
    try {
      await this.achievementService.achieve(user.id, request.habitId, -1);

      return ResponseEntity.OK();
    } catch (error) {
      let errorCode: ResponseStatus;

      if (error instanceof BadRequestException) {
        errorCode = ResponseStatus.BAD_REQUEST;
      } else {
        // eslint-disable-next-line no-console
        console.error(`습관 달성 취소 실패`, error);
        errorCode = ResponseStatus.SERVER_ERROR;
      }

      return ResponseEntity.ERROR_WITH(error.message, errorCode);
    }
  }
}
