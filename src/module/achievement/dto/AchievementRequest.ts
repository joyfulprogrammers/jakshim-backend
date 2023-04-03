import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AchievementRequest {
  @ApiProperty({
    example: 1,
    description: '습관 아이디',
  })
  @IsNumber()
  habitId: number;
}
