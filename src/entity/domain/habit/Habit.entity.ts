import {
  Entity,
  IdentifiedReference,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { BaseTimeEntity } from '../BaseTimeEntity';
import { User } from '../user/User.entity';
import { HabitType } from './type/HabitType';

@Entity({ tableName: 'habits' })
export class Habit extends BaseTimeEntity {
  @ManyToOne({ index: true })
  user: IdentifiedReference<User>;

  @Property({ comment: '습관 이름' })
  name: string;

  @Property({ comment: '습관 테마 색상' })
  themeColor: string;

  @Property({ comment: '습관 폰트 색상' })
  fontColor: string;

  @Property({ comment: '습관 아이콘 이미지' })
  iconImageUrl: string;

  @Property({ comment: '습관 달성 기준 횟수' })
  targetCount: number;

  @Property({ comment: '습관 타입' })
  type: HabitType;

  @Property({
    comment:
      '중요 습관이면, 달성 주기에 해당하는 날을 ‘달성한 날’로 체크하는 데 기준이 됨',
  })
  isImportant: boolean;

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

  @Property({ comment: '주기가 일주일인지 여부' })
  cycleWeek: boolean;

  @Property({ comment: '주기가 한 달인지 여부' })
  cycleMonth: boolean;
}
