import { Entity, Property } from '@mikro-orm/core';
import { BaseTimeEntity } from '../BaseTimeEntity';

@Entity({ tableName: 'users' })
export class User extends BaseTimeEntity {
  @Property({ comment: '사용자 닉네임' })
  nickname: string;
}
