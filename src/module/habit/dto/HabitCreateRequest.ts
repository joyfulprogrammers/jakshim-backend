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
import { Habit } from '../../../entity/domain/habit/Habit.entity';
import { DateTimeUtil } from '../../../entity/util/DateTimeUtil';
import { BadHabitRequest } from './BadHabitRequest';
import { Type } from 'class-transformer';
import { Badhabit } from '../../../entity/domain/badhabit/Badhabit.entity';
import { BadRequestException } from '@nestjs/common';

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
  startedTime: string;

  @ApiProperty({
    type: 'string',
    example: '23:59',
    description: '습관 종료 시간',
  })
  @ValidateIf((dto: HabitCreateRequest) => !dto.isAllDay)
  @IsNotEmpty()
  endedTime: string;

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
    const allDayTime = this.getAllDayTime();
    let startedTime = null;
    let endedTime = null;

    if (allDayTime) {
      startedTime = allDayTime.startedTime;
      endedTime = allDayTime.endedTime;
    }

    startedTime = DateTimeUtil.toLocalTimeBy(this.startedTime);
    endedTime = DateTimeUtil.toLocalTimeBy(this.endedTime);

    if (startedTime === null || endedTime === null) {
      throw new BadRequestException(
        `startedTime 또는 endedTime이 잘못되었습니다. ${this.startedTime} | ${this.endedTime}`,
      );
    }

    return Habit.create(
      userId,
      this.icon,
      this.name,
      this.targetCount,
      startedTime,
      endedTime,
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
