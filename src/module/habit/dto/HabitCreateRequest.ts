import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { LocalTime } from '@js-joda/core';
import { ToLocalTime } from '../../../decorator/ToLocalTime';
import { Habit } from '../../../entity/domain/habit/Habit.entity';
import { DateTimeUtil } from '../../../entity/util/DateTimeUtil';
import { BadHabitRequest } from './BadHabitRequest';
import { Type } from 'class-transformer';
import { Badhabit } from '../../../entity/domain/badhabit/Badhabit.entity';

export class HabitCreateRequest {
  @ApiPropertyOptional({
    example: 'dancing_rion',
    description: '습관 아이콘',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiProperty({
    example: '운동',
    description: '습관명',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 5,
    description: '습관 조각 달성 횟수',
  })
  @IsNumber()
  targetCount: number;

  @ApiProperty({
    type: 'string',
    example: '00:00',
    description: '습관 시작 시간',
  })
  @ValidateIf((dto: HabitCreateRequest) => !dto.isAllDay)
  @IsNotEmpty()
  @ToLocalTime()
  startedTime: LocalTime;

  @ApiProperty({
    type: 'string',
    example: '23:59',
    description: '습관 종료 시간',
  })
  @ValidateIf((dto: HabitCreateRequest) => !dto.isAllDay)
  @IsNotEmpty()
  @ToLocalTime()
  endedTime: LocalTime;

  @ApiProperty({
    example: true,
    description: '하루 종일 달성 가능 여부',
  })
  @IsBoolean()
  isAllDay: boolean;

  @ApiProperty({
    example: true,
    description: '월요일 주기 여부',
  })
  @IsBoolean()
  cycleMonday: boolean;

  @ApiProperty({
    example: true,
    description: '화요일 주기 여부',
  })
  @IsBoolean()
  cycleTuesday: boolean;

  @ApiProperty({
    example: true,
    description: '수요일 주기 여부',
  })
  @IsBoolean()
  cycleWednesday: boolean;

  @ApiProperty({
    example: true,
    description: '목요일 주기 여부',
  })
  @IsBoolean()
  cycleThursday: boolean;

  @ApiProperty({
    example: true,
    description: '금요일 주기 여부',
  })
  @IsBoolean()
  cycleFriday: boolean;

  @ApiProperty({
    example: true,
    description: '토요일 주기 여부',
  })
  @IsBoolean()
  cycleSaturday: boolean;

  @ApiProperty({
    example: true,
    description: '일요일 주기 여부',
  })
  @IsBoolean()
  cycleSunday: boolean;

  @ApiProperty({
    example: true,
    description: '매일 주기 여부',
  })
  @IsBoolean()
  cycleWeek: boolean;

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

  toEntity(userId: number): Habit {
    this.setAllDayTime();

    return Habit.create(
      userId,
      this.icon,
      this.name,
      this.targetCount,
      this.startedTime,
      this.endedTime,
      this.isAllDay,
      this.cycleMonday,
      this.cycleTuesday,
      this.cycleWednesday,
      this.cycleThursday,
      this.cycleFriday,
      this.cycleSaturday,
      this.cycleSunday,
      this.cycleWeek,
    );
  }

  setAllDayTime(): void {
    if (this.isAllDay) {
      this.startedTime = DateTimeUtil.getLocalTimeMin();
      this.endedTime = DateTimeUtil.getLocalTimeMax();
    }
  }

  toBadHabitEntities(userId: number) {
    return this.badhabits
      ? this.badhabits
          .filter((badHabit) => !badHabit.id)
          .map((badHabit) => Badhabit.create(userId, badHabit.name))
      : [];
  }

  get existedBadHabits(): BadHabitRequest[] {
    return this.badhabits
      ? this.badhabits.filter((badHabit) => !!badHabit.id)
      : [];
  }

  get hasBadHabits(): boolean {
    return this.badhabits ? this.badhabits?.length > 0 : false;
  }
}
