import {
  Entity,
  IdentifiedReference,
  ManyToOne,
  Property,
  Reference,
} from '@mikro-orm/core';
import { BaseTimeEntity } from '../BaseTimeEntity';
import { Habit } from '../habit/Habit.entity';
import { User } from '../user/User.entity';
import { DateTimeUtil } from 'src/entity/util/DateTimeUtil';

@Entity({ tableName: 'achievements' })
export class Achievement extends BaseTimeEntity {
  @ManyToOne(() => User, { index: true })
  user: IdentifiedReference<User>;

  @ManyToOne(() => Habit, { index: true })
  habit: IdentifiedReference<Habit>;

  @Property({
    comment:
      '습관 달성 기준 횟수. count가 targetCount에 도달하면 달성으로 처리',
  })
  targetCount: number;

  @Property({ comment: '습관 횟수' })
  count: number;

  static create(
    userId: number,
    habitId: number,
    targetCount: number,
    count = 1,
  ) {
    const achievement = new Achievement();

    achievement.user = Reference.createFromPK(User, userId);
    achievement.habit = Reference.createFromPK(Habit, habitId);
    achievement.targetCount = targetCount;
    achievement.count = count;

    return achievement;
  }

  isTodayAchievement() {
    const today = DateTimeUtil.getTodayMin();
    const tomorrow = today.plusDays(1);

    return this.createdAt.isAfter(today) && this.createdAt.isBefore(tomorrow);
  }

  update(request: { targetCount?: number; count?: number }) {
    Object.assign(this, request);
  }
}
