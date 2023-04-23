import { Habit } from 'src/entity/domain/habit/Habit.entity';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DateTimeUtil } from '../../../entity/util/DateTimeUtil';

export class HabitFindResponse {
  @Exclude() private readonly _habit: {
    id: number;
    name: string;
    startedTime: string;
    endedTime: string;
    weeklyCycle: string[];
    achievementCount: number;
    achievementTargetCount: number;

    createdAt: string;
    updatedAt: string;
  };

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

    this._habit = {
      id: habit.id,
      name: habit.name,
      startedTime: DateTimeUtil.toString(habit.startedTime),
      endedTime: DateTimeUtil.toString(habit.endedTime),
      weeklyCycle,
      createdAt: DateTimeUtil.toString(habit.createdAt),
      updatedAt: DateTimeUtil.toString(habit.updatedAt),
      achievementCount: achievement ? achievement.count : 0,
      achievementTargetCount: habit.targetCount,
    };
  }

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'number', description: '습관 아이디' },
      name: { type: 'string', description: '습관 이름' },
      startedTime: {
        type: 'string',
        description: '습관 시작 시간',
        example: '00:00',
      },
      endedTime: {
        type: 'string',
        description: '습관 종료 시간',
        example: '23:59',
      },
      weeklyCycle: {
        type: 'array',
        description: '습관 주기',
        items: {
          type: 'string',
          enum: [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
          ],
        },
      },
      achievementCount: {
        type: 'number',
        description: '습관 달성 횟수',
        example: 1,
      },
      achievementTargetCount: {
        type: 'number',
        description: '습관 목표 횟수',
        example: 5,
      },
      createdAt: {
        type: 'string',
        description: '습관 생성 시간',
        example: '2023-04-23 08:41:03',
      },
      updatedAt: {
        type: 'string',
        description: '습관 수정 시간',
        example: '2023-04-23 08:41:03',
      },
    },
    description: '습관 정보',
  })
  @Expose()
  get habit() {
    return this._habit;
  }
}
