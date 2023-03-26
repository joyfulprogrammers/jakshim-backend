import { Habit } from 'src/entity/domain/habit/Habit.entity';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DateTimeUtil } from 'src/entity/util/DateTimeUtil';

export class HabitFindResponse {
  @Exclude() private readonly _habit: {
    id: number;
    name: string;
    targetCount: number;
    startedAt: string;
    endedAt: string;
    isAllDay: boolean;
    cycleMonday: boolean;
    cycleTuesday: boolean;
    cycleWednesday: boolean;
    cycleThursday: boolean;
    cycleFriday: boolean;
    cycleSaturday: boolean;
    cycleSunday: boolean;
    cycleWeek: boolean;
    createdAt: string;
    updatedAt: string;
  };

  constructor(habit: Habit) {
    this._habit = {
      id: habit.id,
      name: habit.name,
      targetCount: habit.targetCount,
      startedAt: DateTimeUtil.toString(habit.startedAt),
      endedAt: DateTimeUtil.toString(habit.endedAt),
      isAllDay: habit.isAllDay,
      cycleMonday: habit.cycleMonday,
      cycleTuesday: habit.cycleTuesday,
      cycleWednesday: habit.cycleWednesday,
      cycleThursday: habit.cycleThursday,
      cycleFriday: habit.cycleFriday,
      cycleSaturday: habit.cycleSaturday,
      cycleSunday: habit.cycleSunday,
      cycleWeek: habit.cycleWeek,
      createdAt: DateTimeUtil.toString(habit.createdAt),
      updatedAt: DateTimeUtil.toString(habit.updatedAt),
    };
  }

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'number', description: '습관 아이디' },
      name: { type: 'string', description: '습관 이름' },
      targetCount: { type: 'number', description: '습관 달성 기준 횟수' },
      startedAt: { type: 'string', description: '습관 시작 시간' },
      endedAt: { type: 'string', description: '습관 종료 시간' },
      isAllDay: {
        type: 'boolean',
        description: '하루 종일 달성 가능한 습관 여부',
      },
      cycleMonday: {
        type: 'boolean',
        description: '주기에 월요일 포함 여부',
      },
      cycleTuesday: {
        type: 'boolean',
        description: '주기에 화요일 포함 여부',
      },
      cycleWednesday: {
        type: 'boolean',
        description: '주기에 수요일 포함 여부',
      },
      cycleThursday: {
        type: 'boolean',
        description: '주기에 목요일 포함 여부',
      },
      cycleFriday: {
        type: 'boolean',
        description: '주기에 금요일 포함 여부',
      },
      cycleSaturday: {
        type: 'boolean',
        description: '주기에 토요일 포함 여부',
      },
      cycleSunday: {
        type: 'boolean',
        description: '주기에 일요일 포함 여부',
      },
      cycleWeek: { type: 'boolean', description: '주기에 매주 포함 여부' },
      createdAt: { type: 'string', description: '습관 생성 시간' },
      updatedAt: { type: 'string', description: '습관 수정 시간' },
    },
    description: '습관 정보',
  })
  @Expose()
  get habit() {
    return this._habit;
  }
}
