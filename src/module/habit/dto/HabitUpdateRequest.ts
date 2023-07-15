import { LocalTime } from '@js-joda/core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BadHabitRequest } from './BadHabitRequest';
import { Type } from 'class-transformer';
import { Badhabit } from 'src/entity/domain/badhabit/Badhabit.entity';
import { DateTimeUtil } from 'src/entity/util/DateTimeUtil';
import { Habit } from 'src/entity/domain/habit/Habit.entity';
import { BadRequestException } from '@nestjs/common';

export class HabitUpdateRequest {
  @ApiPropertyOptional({
    example: 'dancing_rion',
    description: '습관 아이콘',
  })
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    example: '운동',
    description: '습관명',
  })
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 5,
    description: '습관 달성 조각 횟수',
  })
  @IsNumber()
  targetCount?: number;

  @ApiPropertyOptional({
    type: 'string',
    example: '12:30',
    description: '습관 시작일',
  })
  startedTime?: string;

  @ApiPropertyOptional({
    type: 'string',
    example: '13:30',
    description: '습관 종료일',
  })
  endedTime?: string;

  @ApiPropertyOptional({
    example: true,
    description: '하루 종일 달성 가능 여부',
  })
  @IsBoolean()
  @IsOptional()
  isAllDay?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: '월요일 주기 여부',
  })
  @IsBoolean()
  cycleMonday?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: '화요일 주기 여부',
  })
  @IsBoolean()
  cycleTuesday?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: '수요일 주기 여부',
  })
  @IsBoolean()
  cycleWednesday?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: '목요일 주기 여부',
  })
  @IsBoolean()
  cycleThursday?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: '금요일 주기 여부',
  })
  @IsBoolean()
  cycleFriday?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: '토요일 주기 여부',
  })
  @IsBoolean()
  cycleSaturday?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: '일요일 주기 여부',
  })
  @IsBoolean()
  cycleSunday?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: '매일 주기 여부',
  })
  @IsBoolean()
  cycleWeek?: boolean;

  @ApiPropertyOptional({
    type: BadHabitRequest,
    isArray: true,
    description: '{ id?: number, name: string }',
    example: [{ name: '유튜브 보기' }, { name: '라면먹기' }],
  })
  @IsOptional()
  @IsArray()
  @Type(() => BadHabitRequest)
  badhabits?: BadHabitRequest[];

  /**
   * id가 없는 badhabit을 생성하기 위한 badhabit entity를 반환합니다.
   * @param userId 유저 id
   */
  toBadHabitEntities(userId: number) {
    return this.badhabits
      ? this.badhabits
          .filter((badHabit) => !badHabit.id)
          .map((badHabit) => Badhabit.create(userId, badHabit.name))
      : [];
  }

  toPartialEntity(): Partial<Omit<Habit, 'user'>> {
    const allDayTime = this.getAllDayTime();
    let startedTime: LocalTime | undefined;
    let endedTime: LocalTime | undefined;

    if (allDayTime) {
      startedTime = allDayTime.startedTime;
      endedTime = allDayTime.endedTime;
    } else {
      startedTime = this.startedTime
        ? DateTimeUtil.toLocalTimeBy(this.startedTime) || undefined
        : undefined;
      endedTime = this.endedTime
        ? DateTimeUtil.toLocalTimeBy(this.endedTime) || undefined
        : undefined;
    }

    if (startedTime === null || endedTime === null) {
      throw new BadRequestException(
        `startedTime 또는 endedTime이 잘못되었습니다. ${this.startedTime} | ${this.endedTime}`,
      );
    }

    return {
      icon: this.icon,
      name: this.name,
      targetCount: this.targetCount,
      startedTime,
      endedTime,
      isAllDay: this.isAllDay,
      cycleMonday: this.cycleMonday,
      cycleTuesday: this.cycleTuesday,
      cycleWednesday: this.cycleWednesday,
      cycleThursday: this.cycleThursday,
      cycleFriday: this.cycleFriday,
      cycleSaturday: this.cycleSaturday,
      cycleSunday: this.cycleSunday,
      cycleWeek: this.cycleWeek,
    };
  }

  private getAllDayTime() {
    if (this.isAllDay) {
      return {
        startedTime: DateTimeUtil.getLocalTimeMin(),
        endedTime: DateTimeUtil.getLocalTimeMax(),
      };
    }
  }

  /**
   * id가 있는 badhabit만 반환합니다.
   */
  get existedBadHabits(): BadHabitRequest[] {
    return this.badhabits
      ? this.badhabits.filter((badHabit) => !!badHabit.id)
      : [];
  }

  /**
   * badhabit이 있는지 여부를 반환합니다.
   */
  get hasBadHabits(): boolean {
    return this.badhabits ? this.badhabits?.length > 0 : false;
  }
}
