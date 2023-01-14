import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HabitCreateRequest } from './dto/HabitCreateRequest';
import { HabitService } from './HabitService';
import { LoggedInGuard } from '../auth/guard/LoggedInGuard';
import { ResponseStatus } from '../../libs/res/ResponseStatus';
import { ResponseEntity } from '../../libs/res/ResponseEntity';

@ApiTags('HABIT')
@UseGuards(LoggedInGuard)
@Controller('api/habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post('/create')
  @ApiCookieAuth()
  @ApiOperation({
    summary: '습관 생성 API',
    description: '습관을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '습관 생성 성공',
  })
  async createHabit(@Body() request: HabitCreateRequest) {
    try {
      await this.habitService.createHabit(request);
    } catch (error) {
      let errorCode: ResponseStatus;

      if (error instanceof BadRequestException) {
        errorCode = ResponseStatus.BAD_REQUEST;
      } else {
        // eslint-disable-next-line no-console
        console.error(`습관 생성 실패`, error);
        errorCode = ResponseStatus.SERVER_ERROR;
      }

      return ResponseEntity.ERROR_WITH(error.message, errorCode);
    }
  }

  @Post('/update')
  @ApiOperation({
    summary: '습관 수정 API',
    description: '습관을 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '습관 수정 성공',
  })
  async updateHabit() {}
}
