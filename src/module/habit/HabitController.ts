import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { HabitCreateRequest } from './dto/HabitCreateRequest';
import { HabitService } from './HabitService';
import { ResponseStatus } from '../../libs/res/ResponseStatus';
import { ResponseEntity } from '../../libs/res/ResponseEntity';
import { HabitUpdateRequest } from './dto/HabitUpdateRequest';
import { LoggedInGuard } from '../auth/guard/LoggedInGuard';
import { HabitUpdateResponse } from './dto/HabitUpdateResponse';
import { ApiOkResponseBy } from '../../libs/res/swagger/ApiOkResponseBy';
import { Session } from '../../decorator/Session';
import { HabitDeleteResponse } from './dto/HabitDeleteResponse';
import { HabitCreateResponse } from './dto/HabitCreateResponse';
import { HabitFindResponse } from './dto/HabitFindResponse';
import { HabitFindListResponse } from './dto/HabitFindListResponse';
import { AuthSessionDto } from '../auth/dto/AuthSessionDto';
import { LocalDate } from '@js-joda/core';
import { DateTimeUtil } from 'src/entity/util/DateTimeUtil';

@ApiTags('HABIT')
@UseGuards(LoggedInGuard)
@Controller('api/habits')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Get('/:id')
  @ApiCookieAuth()
  @ApiOperation({
    summary: '습관 조회 API (개발 진행중)',
    description: '습관 상세를 조회합니다.',
  })
  @ApiParam({
    type: 'string',
    name: 'id',
    description: '습관 id',
    example: 2,
  })
  @ApiOkResponseBy(HabitFindResponse)
  async getHabit(
    @Param('id', ParseIntPipe) id: number,
    @Session() user: AuthSessionDto,
  ) {
    try {
      const habit = await this.habitService.findOneHabit(id, user.id);

      return ResponseEntity.OK_WITH(new HabitFindResponse(habit!)); // TODO: habit이 없을 경우 처리
    } catch (error) {
      let errorCode: ResponseStatus;

      if (error instanceof BadRequestException) {
        errorCode = ResponseStatus.BAD_REQUEST;
      } else {
        // eslint-disable-next-line no-console
        console.error(`습관 조회 실패 (api/habits/:id)`, error);
        errorCode = ResponseStatus.SERVER_ERROR;
      }

      return ResponseEntity.ERROR_WITH(error.message, errorCode);
    }
  }

  @Get()
  @ApiCookieAuth()
  @ApiOperation({
    summary: '날짜 습관 조회 API',
    description: '질의한 날의 달성해야 하는 습관을 조회합니다.',
  })
  @ApiQuery({
    required: false,
    type: 'string',
    name: 'date',
    description: '조회할 날짜',
    example: '',
  })
  @ApiOkResponseBy(HabitFindListResponse)
  async getHabits(
    @Query('date') date: string,
    @Session() user: AuthSessionDto,
  ) {
    try {
      if (!date) {
        date = DateTimeUtil.toString(LocalDate.now());
      }
      user;
      const habits = await this.habitService.findHabits({
        userId: user.id,
        date,
      });

      return ResponseEntity.OK_WITH(
        habits.map((habit) => new HabitFindListResponse(habit)),
      );
    } catch (error) {
      let errorCode: ResponseStatus;

      if (error instanceof BadRequestException) {
        errorCode = ResponseStatus.BAD_REQUEST;
      } else {
        // eslint-disable-next-line no-console
        console.error(`날짜 습관 조회 API (api/habits?)`, error);
        errorCode = ResponseStatus.SERVER_ERROR;
      }

      return ResponseEntity.ERROR_WITH(error.message, errorCode);
    }
  }

  @Post()
  @ApiCookieAuth()
  @ApiOperation({
    summary: '습관 생성 API',
    description: '습관을 생성합니다.',
  })
  @ApiOkResponseBy(HabitCreateResponse)
  async createHabit(
    @Body() request: HabitCreateRequest,
    @Session() user: AuthSessionDto,
  ) {
    try {
      const habit = await this.habitService.createHabit(request, user.id);

      return ResponseEntity.OK_WITH(new HabitCreateResponse(habit));
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
  @ApiOkResponseBy(HabitUpdateResponse)
  async updateHabit(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: HabitUpdateRequest,
    @Session() user: AuthSessionDto,
  ) {
    try {
      const habit = await this.habitService.update(id, request, user.id);

      return ResponseEntity.OK_WITH(new HabitUpdateResponse(habit));
    } catch (error) {
      // TODO: logger 로직 필요
      console.error(error);

      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: '습관 삭제 API',
    description: '습관을 삭제합니다.',
  })
  @ApiParam({
    type: 'string', // codegen 을 위한 타입 변경
    name: 'id',
    description: '습관 id',
    example: 2,
  })
  @ApiOkResponseBy(HabitUpdateResponse)
  async deleteHabit(
    @Param('id', ParseIntPipe) id: number,
    @Session() user: AuthSessionDto,
  ) {
    try {
      const habit = await this.habitService.delete(id, user.id);

      return ResponseEntity.OK_WITH(new HabitDeleteResponse(habit));
    } catch (error) {
      // TODO: logger 로직 필요
      console.error(error);

      throw error;
    }
  }
}
