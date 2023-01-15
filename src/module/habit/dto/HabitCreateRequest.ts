import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { HabitType } from '../../../entity/domain/habit/type/HabitType';

export class HabitCreateRequest {
  @ApiProperty({
    example: '운동',
    description: '습관명',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '#fff',
    description: '습관 테마 색상',
  })
  @IsString()
  themeColor: string;

  @ApiProperty({
    example: '#000',
    description: '습관 폰트 색상',
  })
  @IsString()
  fontColor: string;

  @ApiProperty({
    example: 'https://cdn.inflearn.com/public/main/profile/default_profile.png',
    description: '습관 이미지 주소',
  })
  @IsString()
  iconImageUrl: string;

  @ApiProperty({
    example: 5,
    description: '습관 달성 조각 횟수',
  })
  @IsNumber()
  targetCount: number;

  @ApiProperty({
    example: 'POSITIVE',
    description: '습관 타입',
  })
  @IsString()
  @IsEnum(HabitType)
  type: HabitType;

  @ApiProperty({
    example: true,
    description: '중요 습관 여부',
  })
  @IsBoolean()
  isImportant: boolean;

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
}
