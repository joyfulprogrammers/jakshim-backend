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
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @IsString()
  name: string;

  @IsNumber()
  targetCount: number;

  @ValidateIf((dto: HabitCreateRequest) => !dto.isAllDay)
  @IsNotEmpty()
  @ToLocalTime()
  startedTime: LocalTime;

  @ValidateIf((dto: HabitCreateRequest) => !dto.isAllDay)
  @IsNotEmpty()
  @ToLocalTime()
  endedTime: LocalTime;

  @IsBoolean()
  isAllDay: boolean;

  @IsBoolean()
  cycleMonday: boolean;

  @IsBoolean()
  cycleTuesday: boolean;

  @IsBoolean()
  cycleWednesday: boolean;

  @IsBoolean()
  cycleThursday: boolean;

  @IsBoolean()
  cycleFriday: boolean;

  @IsBoolean()
  cycleSaturday: boolean;

  @IsBoolean()
  cycleSunday: boolean;

  @IsBoolean()
  cycleWeek: boolean;

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
