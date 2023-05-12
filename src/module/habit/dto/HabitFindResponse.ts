import { Habit } from 'src/entity/domain/habit/Habit.entity';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DateTimeUtil } from '../../../entity/util/DateTimeUtil';

export class HabitFindResponse {
  @Exclude() private readonly _habit: {
    id: number;
    icon?: string;
    name: string;
    startedTime: string;
    endedTime: string;
    weeklyCycle: string[];
    achievementCount: number;
    achievementTargetCount: number;
    achievements: {
      id: number;
      count: number;
      targetCount: number;
      createdAt: string;
    }[];
    badhabits: {
      id: number;
      name: string;
    }[];

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

    const todayAchievement = habit.achievement
      ?.getItems()
      .find((achievement) => achievement.isTodayAchievement());
    const achievements =
      habit.achievement?.getItems().map((achievement) => ({
        id: achievement.id,
        count: achievement.count,
        targetCount: achievement.targetCount,
        createdAt: DateTimeUtil.toString(achievement.createdAt),
      })) || [];

    const badhabits = (() => {
      const badhabits = [] as any;

      if (habit.habitBadhabit) {
        const habitBadhabits = habit.habitBadhabit.getItems();

        for (const habitBadhabit of habitBadhabits) {
          const badhabit = habitBadhabit.badhabit;

          if (badhabit) {
            badhabits.push({
              id: habitBadhabit.badhabit.id,
              name: habitBadhabit.badhabit.getEntity().name,
            });
          }
        }
      }

      return badhabits;
    })();

    this._habit = {
      id: habit.id,
      icon: habit.icon,
      name: habit.name,
      startedTime: DateTimeUtil.toString(habit.startedTime),
      endedTime: DateTimeUtil.toString(habit.endedTime),
      weeklyCycle,
      achievements,
      achievementCount: todayAchievement ? todayAchievement.count : 0,
      achievementTargetCount: habit.targetCount,
      badhabits,

      createdAt: DateTimeUtil.toString(habit.createdAt),
      updatedAt: DateTimeUtil.toString(habit.updatedAt),
    };
  }

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'number', description: '습관 아이디' },
      icon: { type: 'string', description: '습관 아이콘' },
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
      achievements: {
        type: 'array',
        description: '습관 달성 정보',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', description: '습관 달성 아이디' },
            count: { type: 'number', description: '습관 달성 횟수' },
            targetCount: { type: 'number', description: '습관 목표 횟수' },
            createdAt: {
              type: 'string',
              description: '습관 달성 시간',
              example: '2023-04-23 08:41:03',
            },
          },
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
      badhabits: {
        type: 'array',
        description: '부정 습관',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', description: '부정 습관 아이디', example: 1 },
            name: {
              type: 'string',
              description: '부정 습관 이름',
              example: '늦잠',
            },
          },
        },
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
