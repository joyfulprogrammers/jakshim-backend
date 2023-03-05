import { LocalDateTime } from '@js-joda/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsString } from 'class-validator';

export class HabitUpdateRequest {
  @ApiProperty({
    example: 1,
    description: '유저 아이디',
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    example: '운동',
    description: '습관명',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 5,
    description: '습관 달성 조각 횟수',
  })
  @IsNumber()
  targetCount: number;

  @ApiProperty({
    example: new Date(),
    description: '습관 시작일',
  })
  startedAt: LocalDateTime;

  @ApiProperty({
    example: new Date(),
    description: '습관 종료일',
  })
  endedAt: LocalDateTime;

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
    example: false,
    description: '매일 주기 여부',
  })
  @IsBoolean()
  cycleWeek: boolean;
}
