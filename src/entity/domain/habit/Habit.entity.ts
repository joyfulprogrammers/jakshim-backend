import {
  Collection,
  Entity,
  IdentifiedReference,
  ManyToOne,
  OneToMany,
  Property,
  Reference,
} from '@mikro-orm/core';
import { BaseTimeEntity } from '../BaseTimeEntity';
import { User } from '../user/User.entity';
import { LocalDateTime, LocalTime } from '@js-joda/core';
import { LocalDateTimeType } from '../../type/LocalDateTimeType';
import { LocalTimeType } from '../../type/LocalTimeType';
import { Achievement } from '../achievement/Achievement.entity';
import { HabitBadhabit } from '../habitBadhabit/HabitBadhabit.entity';
import { Exclude } from 'class-transformer';

@Entity({ tableName: 'habits' })
export class Habit extends BaseTimeEntity {
  @ManyToOne({ index: true })
  user: IdentifiedReference<User>;

  @Exclude()
  @OneToMany(() => Achievement, (achievement) => achievement.habit)
  achievement?: Collection<Achievement, this>;

  @Exclude()
  @OneToMany(() => HabitBadhabit, (habitBadhabit) => habitBadhabit.habit)
  habitBadhabit?: Collection<HabitBadhabit, this>;

  @Property({ comment: '습관 아이콘' })
  icon?: string;

  @Property({ comment: '습관 이름' })
  name: string;

  @Property({ comment: '습관 달성 기준 횟수' })
  targetCount: number;

  @Property({ type: LocalTimeType, comment: '습관 시작 시간' })
  startedTime: LocalTime;

  @Property({ type: LocalTimeType, comment: '습관 종료 시간' })
  endedTime: LocalTime;

  @Property({ comment: '하루 종일 달성 가능한 습관 여부' })
  isAllDay: boolean;

  @Property({ comment: '주기에 월요일 포함 여부' })
  cycleMonday: boolean;

  @Property({ comment: '주기에 화요일 포함 여부' })
  cycleTuesday: boolean;

  @Property({ comment: '주기에 수요일 포함 여부' })
  cycleWednesday: boolean;

  @Property({ comment: '주기에 목요일 포함 여부' })
  cycleThursday: boolean;

  @Property({ comment: '주기에 금요일 포함 여부' })
  cycleFriday: boolean;

  @Property({ comment: '주기에 토요일 포함 여부' })
  cycleSaturday: boolean;

  @Property({ comment: '주기에 일요일 포함 여부' })
  cycleSunday: boolean;

  @Property({
    comment: '주기가 일주일인지 여부(일주일 중 아무 날에 달성 가능)',
  })
  cycleWeek: boolean;

  @Property({ type: LocalDateTimeType, comment: '삭제 시각' })
  deletedAt?: LocalDateTime;

  // 년월일을 받아서 해당 날짜에 해당하는 주기 조건을 반환합니다.
  static getCycleOnDate(date?: string) {
    if (!date) {
      return {};
    }

    const day = new Date(date).getDay();
    const cycles: {
      cycleMonday?: boolean;
      cycleTuesday?: boolean;
      cycleWednesday?: boolean;
      cycleThursday?: boolean;
      cycleFriday?: boolean;
      cycleSaturday?: boolean;
      cycleSunday?: boolean;
    } = {};

    switch (day) {
      case 0:
        cycles['cycleSunday'] = true;
        break;
      case 1:
        cycles['cycleMonday'] = true;
        break;
      case 2:
        cycles['cycleTuesday'] = true;
        break;
      case 3:
        cycles['cycleWednesday'] = true;
        break;
      case 4:
        cycles['cycleThursday'] = true;
        break;
      case 5:
        cycles['cycleFriday'] = true;
        break;
      case 6:
        cycles['cycleSaturday'] = true;
        break;
    }

    return cycles;
  }

  static create(
    userId: number,
    icon: string | undefined,
    name: string,
    targetCount: number,
    startedTime: LocalTime,
    endedTime: LocalTime,
    isAllDay: boolean,
    cycleMonday: boolean,
    cycleTuesday: boolean,
    cycleWednesday: boolean,
    cycleThursday: boolean,
    cycleFriday: boolean,
    cycleSaturday: boolean,
    cycleSunday: boolean,
    cycleWeek: boolean,
  ) {
    const habit = new Habit();
    habit.icon = icon;
    habit.name = name;
    habit.isAllDay = isAllDay;
    habit.cycleMonday = cycleMonday;
    habit.cycleTuesday = cycleTuesday;
    habit.cycleWednesday = cycleWednesday;
    habit.cycleThursday = cycleThursday;
    habit.cycleFriday = cycleFriday;
    habit.cycleSaturday = cycleSaturday;
    habit.cycleSunday = cycleSunday;
    habit.cycleWeek = cycleWeek;
    habit.targetCount = targetCount;
    habit.startedTime = startedTime;
    habit.endedTime = endedTime;

    habit.user = Reference.createFromPK(User, userId);

    return habit;
  }

  update(request: Partial<Omit<Habit, 'user'>>) {
    Object.assign(this, request);
  }

  delete(now: LocalDateTime) {
    this.deletedAt = now;
  }
}
