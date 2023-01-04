import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class HabitCreateRequest {
  @ApiProperty()
  @IsNumber()
  id: number;
}
