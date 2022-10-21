import {
  Entity,
  IdentifiedReference,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { BaseTimeEntity } from '../BaseTimeEntity';
import { Habit } from '../habit/Habit.entity';
import { HabitType } from '../habit/type/HabitType';
import { User } from '../user/User.entity';

@Entity()
export class Achievement extends BaseTimeEntity {
  @ManyToOne({ index: true })
  user: IdentifiedReference<User>;

  @ManyToOne({ index: true })
  habit: IdentifiedReference<Habit>;

  @Property({
    comment:
      '습관 달성 기준 횟수. count가 targetCount에 도달하면 달성으로 처리',
  })
  targetCount: number;

  @Property({ comment: '습관 타입' })
  type: HabitType;

  @Property({ comment: '습관 횟수' })
  count: number;
}
