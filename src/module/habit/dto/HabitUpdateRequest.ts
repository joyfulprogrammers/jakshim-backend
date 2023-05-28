import { LocalTime } from '@js-joda/core';
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
  @IsString()
  icon?: string;

  @IsString()
  name?: string;

  @IsNumber()
  targetCount?: number;

  @ToLocalTime()
  startedTime?: LocalTime;

  @ToLocalTime()
  endedTime?: LocalTime;

  @IsBoolean()
  isAllDay?: boolean;

  @IsBoolean()
  cycleMonday?: boolean;

  @IsBoolean()
  cycleTuesday?: boolean;

  @IsBoolean()
  cycleWednesday?: boolean;

  @IsBoolean()
  cycleThursday?: boolean;

  @IsBoolean()
  cycleFriday?: boolean;

  @IsBoolean()
  cycleSaturday?: boolean;

  @IsBoolean()
  cycleSunday?: boolean;

  @IsBoolean()
  cycleWeek?: boolean;

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
