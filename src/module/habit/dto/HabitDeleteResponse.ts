import { Habit } from '../../../entity/domain/habit/Habit.entity';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class HabitDeleteResponse {
  @Exclude() private readonly _habit: Habit;
  constructor(habit: Habit) {
    this._habit = habit;
  }

  @ApiProperty({
    type: 'number',
    description: 'habit 아이디',
  })
  @Expose()
  get id() {
    return this._habit.id;
  }
}
