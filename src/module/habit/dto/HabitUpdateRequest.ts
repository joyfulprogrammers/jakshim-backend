import { LocalTime } from '@js-joda/core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ToLocalTime } from '../../../decorator/ToLocalTime';
import { BadHabitRequest } from './BadHabitRequest';
import { Type } from 'class-transformer';
import { Badhabit } from 'src/entity/domain/badhabit/Badhabit.entity';

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
    example: '12:30',
    description: '습관 시작일',
  })
  @ToLocalTime()
  startedTime?: LocalTime;

  @ApiPropertyOptional({
    example: '13:30',
    description: '습관 종료일',
  })
  @ToLocalTime()
  endedTime?: LocalTime;

  @ApiPropertyOptional({
    example: true,
    description: '하루 종일 달성 가능 여부',
  })
  @IsBoolean()
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
