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
import { HabitFindAllResponse } from './dto/HabitFindAllResponse';
import { HabitFindResponse } from './dto/HabitFindResponse';

@ApiTags('HABIT')
@UseGuards(LoggedInGuard)
@Controller('api/habit')
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Get('/all')
  @ApiCookieAuth()
  @ApiOperation({
    summary: '내 습관 조회 API',
    description: '내 습관을 모두 조회합니다.',
  })
  @ApiOkResponseBy(HabitFindAllResponse)
  async getMyHabits(@Session() user) {
    try {
      const habits = await this.habitService.findAllByUser(user.id);

      return ResponseEntity.OK_WITH(
        habits.map((habit) => new HabitFindResponse(habit)),
      );
    } catch (error) {
      let errorCode: ResponseStatus;

      if (error instanceof BadRequestException) {
        errorCode = ResponseStatus.BAD_REQUEST;
      } else {
        // eslint-disable-next-line no-console
        console.error(`습관 조회 실패`, error);
        errorCode = ResponseStatus.SERVER_ERROR;
      }

      return ResponseEntity.ERROR_WITH(error.message, errorCode);
    }
  }

  @Get()
  @ApiCookieAuth()
  @ApiOperation({
    summary: '습관 조회 API',
    description: '습관을 조회합니다.',
  })
  @ApiQuery({
    type: 'number',
    name: 'id',
    description: '습관 id',
  })
  @ApiOkResponseBy(HabitFindResponse)
  async getHabit(@Query('id', ParseIntPipe) id: string, @Session() user) {
    try {
      const habit = await this.habitService.findOneByHabitAndUser(
        Number(id),
        user.id,
      );

      return ResponseEntity.OK_WITH(new HabitFindResponse(habit));
    } catch (error) {
      let errorCode: ResponseStatus;

      if (error instanceof BadRequestException) {
        errorCode = ResponseStatus.BAD_REQUEST;
      } else {
        // eslint-disable-next-line no-console
        console.error(`습관 조회 실패`, error);
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
  async createHabit(@Body() request: HabitCreateRequest, @Session() user) {
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
    @Session() user,
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
  async deleteHabit(@Param('id', ParseIntPipe) id: number, @Session() user) {
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
