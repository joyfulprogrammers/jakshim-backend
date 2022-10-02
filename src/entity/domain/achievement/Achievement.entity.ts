import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTimeEntity } from '../BaseTimeEntity';
import { Habits } from '../habits/Habits.entity';
import { HabitType } from '../habits/type/HabitType';
import { User } from '../user/User.entity';

@Entity()
export class Achievement extends BaseTimeEntity {
  @ManyToOne(() => User, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  userId: number;

  @ManyToOne(() => Habits, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'habit_id', referencedColumnName: 'id' })
  habitId: number;

  @Column({
    comment:
      '습관 달성 기준 횟수. count가 targetCount에 도달하면 달성으로 처리',
  })
  targetCount: number;

  @Column({ comment: '습관 타입' })
  type: HabitType;

  @Column({ comment: '습관 횟수' })
  count: number;
}
