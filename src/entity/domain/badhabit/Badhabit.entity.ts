import {
  Entity,
  IdentifiedReference,
  ManyToOne,
  Property,
  Reference,
} from '@mikro-orm/core';
import { BaseTimeEntity } from '../BaseTimeEntity';
import { User } from '../user/User.entity';

@Entity({ tableName: 'badhabits' })
export class Badhabit extends BaseTimeEntity {
  @ManyToOne({ index: true })
  user: IdentifiedReference<User>;

  @Property({ comment: '부정습관 이름' })
  name: string;

  static create(userId: number, name: string) {
    const badhabit = new Badhabit();

    badhabit.user = Reference.createFromPK(User, userId);
    badhabit.name = name;

    return badhabit;
  }
}
