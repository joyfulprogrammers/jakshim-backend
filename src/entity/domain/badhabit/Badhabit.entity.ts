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
import { HabitBadhabit } from '../habitBadhabit/HabitBadhabit.entity';
import { Exclude } from 'class-transformer';

@Entity({ tableName: 'badhabits' })
export class Badhabit extends BaseTimeEntity {
  @ManyToOne(() => User, { index: true })
  user: IdentifiedReference<User>;

  @Exclude()
  @OneToMany(() => HabitBadhabit, (habitBadhabit) => habitBadhabit.badhabit)
  habitBadhabits?: Collection<HabitBadhabit, this>;

  @Property({ comment: '부정습관 이름' })
  name: string;

  static create(userId: number, name: string) {
    const badhabit = new Badhabit();

    badhabit.user = Reference.createFromPK(User, userId);
    badhabit.name = name;

    return badhabit;
  }
}
