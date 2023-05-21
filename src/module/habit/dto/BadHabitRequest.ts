import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BadHabitRequest {
  @ApiPropertyOptional()
  id?: number;

  @ApiProperty()
  name: string;
}
