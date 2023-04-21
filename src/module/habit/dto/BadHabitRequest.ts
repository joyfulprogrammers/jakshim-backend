import { ApiProperty } from '@nestjs/swagger';

export class BadHabitRequest {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  name: string;
}
