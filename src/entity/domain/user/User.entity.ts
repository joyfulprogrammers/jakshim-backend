import { Column, Entity } from 'typeorm';
import { BaseTimeEntity } from '../BaseTimeEntity';

@Entity()
export class User extends BaseTimeEntity {
  @Column({ comment: '사용자 닉네임' })
  nickname: string;
}
