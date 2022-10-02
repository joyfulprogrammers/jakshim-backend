import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTimeEntity } from '../BaseTimeEntity';
import { User } from '../user/User.entity';
import { HabitType } from './type/HabitType';

@Entity()
export class Habits extends BaseTimeEntity {
  @ManyToOne(() => User, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  userId: number;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column()
  fontColor: string;

  @Column()
  imageUrl: string;

  @Column()
  targetCount: number;

  @Column()
  type: HabitType;

  @Column()
  isImportant: boolean;

  @Column()
  cycleMonday: boolean;

  @Column()
  cycleTuesday: boolean;

  @Column()
  cycleWednesday: boolean;

  @Column()
  cycleThursday: boolean;

  @Column()
  cycleFriday: boolean;

  @Column()
  cycleSaturday: boolean;

  @Column()
  cycleSunday: boolean;

  @Column()
  cycleWeek: boolean;

  @Column()
  cycleMonth: boolean;
}
