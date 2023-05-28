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

export class HabitCreateRequestForSwagger {
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
  @ValidateIf((dto: HabitCreateRequestForSwagger) => !dto.isAllDay)
  @IsNotEmpty()
  startedTime: string;

  @ApiProperty({
    type: 'string',
    example: '23:59',
    description: '습관 종료 시간',
  })
  @ValidateIf((dto: HabitCreateRequestForSwagger) => !dto.isAllDay)
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
    this.setAllDayTime();
    const startedTime = DateTimeUtil.toLocalTimeBy(
      this.startedTime || 'invalid',
    );
    const endedTime = DateTimeUtil.toLocalTimeBy(this.endedTime || 'invalid');

    if (startedTime === null || endedTime === null) {
      throw new Error(
        '유효하지 않은 startedTime or endedTime 값 입니다. at HabitCreateRequest.toEntity()',
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

  setAllDayTime(): void {
    if (this.isAllDay) {
      this.startedTime = DateTimeUtil.toString(DateTimeUtil.getLocalTimeMin());
      this.endedTime = DateTimeUtil.toString(DateTimeUtil.getLocalTimeMax());
    }
  }
}
