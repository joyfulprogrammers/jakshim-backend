import { Entity, Property } from '@mikro-orm/core';
import { PasswordUtil } from '../../../module/auth/util/PasswordUtil';
import { BaseTimeEntity } from '../BaseTimeEntity';

@Entity({ tableName: 'users' })
export class User extends BaseTimeEntity {
  @Property({ comment: '사용자 이메일' })
  email: string;

  @Property({ comment: '사용자 비밀번호', nullable: true })
  password: string;

  @Property({ comment: '사용자 닉네임' })
  nickname: string;

  static async signup(
    email: string,
    password: string,
    nickname: string,
  ): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = await PasswordUtil.encrypt(password);
    user.nickname = nickname;

    return user;
  }
}
