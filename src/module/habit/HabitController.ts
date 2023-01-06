import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { HabitCreateRequest } from './dto/HabitCreateRequest';
import { HabitUpdateRequest } from './dto/HabitUpdateRequest';
import { HabitService } from './HabitService';
import { LoggedInGuard } from '../auth/guard/LoggedInGuard';

@UseGuards(LoggedInGuard)
@Controller('api/habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post('/create')
  @ApiOperation({
    summary: '습관 생성 API',
    description: '습관을 생성합니다.',
  })
  @ApiBody({ type: HabitCreateRequest })
  async createHabit() {}

  @Post('/update')
  @ApiOperation({
    summary: '습관 수정 API',
    description: '습관을 수정합니다.',
  })
  @ApiBody({ type: HabitUpdateRequest })
  async updateHabit() {}
}
