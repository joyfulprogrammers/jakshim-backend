import {
  BadRequestException,
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HabitCreateRequest } from './dto/HabitCreateRequest';
import { HabitService } from './HabitService';
import { ResponseStatus } from '../../libs/res/ResponseStatus';
import { ResponseEntity } from '../../libs/res/ResponseEntity';
import { HabitUpdateRequest } from './dto/HabitUpdateRequest';
import { LoggedInGuard } from '../auth/guard/LoggedInGuard';

@ApiTags('HABIT')
@UseGuards(LoggedInGuard)
@Controller('api/habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  @ApiCookieAuth()
  @ApiOperation({
    summary: '습관 생성 API',
    description: '습관을 생성합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '습관 생성 성공',
  })
  async createHabit(@Body() request: HabitCreateRequest) {
    try {
      const newHabit = await this.habitService.createHabit(request);

      return ResponseEntity.OK_WITH(newHabit.id);
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

  @Patch('/:id')
  @ApiOperation({
    summary: '습관 수정 API',
    description: '습관을 수정합니다.',
  })
  @ApiParam({
    type: 'string', // codegen 을 위한 타입 변경
    name: 'id',
    description: '습관 id',
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: '습관 수정 성공',
  })
  async updateHabit(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: HabitUpdateRequest,
  ) {
    try {
      await this.habitService.update(id, request);

      return ResponseEntity.OK();
    } catch (error) {
      // TODO: logger 로직 필요
      console.error(error);

      throw error;
    }
  }
}
