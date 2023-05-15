import { Habit } from 'src/entity/domain/habit/Habit.entity';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DateTimeUtil } from '../../../entity/util/DateTimeUtil';

export class HabitFindListResponse {
  @Exclude() private readonly _id: number;
  @Exclude() private readonly _icon?: string;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _startedTime: string;
  @Exclude() private readonly _endedTime: string;
  @Exclude() private readonly _weeklyCycle: string[];
  @Exclude() private readonly _achievementCount: number;
  @Exclude() private readonly _achievementTargetCount: number;
  @Exclude() private readonly _createdAt: string;
  @Exclude() private readonly _updatedAt: string;

  constructor(habit: Habit) {
    let weeklyCycle = [];
    if (habit.isAllDay || habit.cycleWeek) {
      // insert every day of the week using english
      weeklyCycle = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ];
    } else {
      if (habit.cycleMonday) {
        weeklyCycle.push('monday');
      }
      if (habit.cycleTuesday) {
        weeklyCycle.push('tuesday');
      }
      if (habit.cycleWednesday) {
        weeklyCycle.push('wednesday');
      }
      if (habit.cycleThursday) {
        weeklyCycle.push('thursday');
      }
      if (habit.cycleFriday) {
        weeklyCycle.push('friday');
      }
      if (habit.cycleSaturday) {
        weeklyCycle.push('saturday');
      }
      if (habit.cycleSunday) {
        weeklyCycle.push('sunday');
      }
    }

    const achievement = habit.achievement?.getItems()[0];

    this._id = habit.id;
    this._icon = habit.icon;
    this._name = habit.name;
    this._startedTime = DateTimeUtil.toString(habit.startedTime);
    this._endedTime = DateTimeUtil.toString(habit.endedTime);
    this._weeklyCycle = weeklyCycle;
    this._createdAt = DateTimeUtil.toString(habit.createdAt);
    this._updatedAt = DateTimeUtil.toString(habit.updatedAt);
    this._achievementCount = achievement ? achievement.count : 0;
    this._achievementTargetCount = habit.targetCount;
  }

  @ApiProperty({
    type: 'number',
    description: '습관 아이디',
    example: 1,
  })
  @Expose()
  get id() {
    return this._id;
  }

  @ApiProperty({
    type: 'string',
    description: '습관 아이콘',
    example: 'dancing_rion',
  })
  @Expose()
  get icon() {
    return this._icon;
  }

  @ApiProperty({
    type: 'string',
    description: '습관 이름',
    example: '운동',
  })
  @Expose()
  get name() {
    return this._name;
  }

  @ApiProperty({
    type: 'string',
    description: '습관 시작 시간',
    example: '00:00',
  })
  @Expose()
  get startedTime() {
    return this._startedTime;
  }

  @ApiProperty({
    type: 'string',
    description: '습관 종료 시간',
    example: '23:59',
  })
  @Expose()
  get endedTime() {
    return this._endedTime;
  }

  @ApiProperty({
    isArray: true,
    type: 'string',
    description: '습관 주기',
    example: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  })
  @Expose()
  get weeklyCycle() {
    return this._weeklyCycle;
  }

  @ApiProperty({
    type: 'number',
    description: '습관 달성 횟수',
    example: 1,
  })
  @Expose()
  get achievementCount() {
    return this._achievementCount;
  }

  @ApiProperty({
    type: 'number',
    description: '습관 달성 목표 횟수',
    example: 3,
  })
  @Expose()
  get achievementTargetCount() {
    return this._achievementTargetCount;
  }

  @ApiProperty({
    type: 'string',
    description: '습관 생성 시간',
    example: '2021-01-01 00:00:00',
  })
  @Expose()
  get createdAt() {
    return this._createdAt;
  }

  @ApiProperty({
    type: 'string',
    description: '습관 수정 시간',
    example: '2021-01-01 00:00:00',
  })
  @Expose()
  get updatedAt() {
    return this._updatedAt;
  }
}
