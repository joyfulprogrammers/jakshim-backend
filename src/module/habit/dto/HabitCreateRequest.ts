import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { HabitType } from '../../../entity/domain/habit/type/HabitType';

export class HabitCreateRequest {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  themeColor: string;

  @ApiProperty()
  @IsString()
  fontColor: string;

  @ApiProperty()
  @IsString()
  iconImageUrl: string;

  @ApiProperty()
  @IsNumber()
  targetCount: number;

  @ApiProperty()
  @IsString()
  @IsEnum(HabitType)
  type: string;

  @ApiProperty()
  @IsBoolean()
  isImportant: boolean;

  @ApiProperty()
  @IsBoolean()
  cycleMonday: boolean;

  @ApiProperty()
  @IsBoolean()
  cycleTuesday: boolean;

  @ApiProperty()
  @IsBoolean()
  cycleWednesday: boolean;

  @ApiProperty()
  @IsBoolean()
  cycleThursday: boolean;

  @ApiProperty()
  @IsBoolean()
  cycleFriday: boolean;

  @ApiProperty()
  @IsBoolean()
  cycleSaturday: boolean;

  @ApiProperty()
  @IsBoolean()
  cycleSunday: boolean;

  @ApiProperty()
  @IsBoolean()
  cycleWeek: boolean;
}
