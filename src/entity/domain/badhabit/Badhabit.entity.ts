import { IdentifiedReference, ManyToOne, Property } from '@mikro-orm/core';
import { BaseTimeEntity } from '../BaseTimeEntity';
import { User } from '../user/User.entity';

export class Badhabit extends BaseTimeEntity {
  @ManyToOne({ index: true })
  user: IdentifiedReference<User>;

  @Property({ comment: '부정습관 이름' })
  name: string;
}
