import { Entity, Property } from '@mikro-orm/core';
import { PasswordUtil } from '../../../module/auth/util/PasswordUtil';
import { BaseTimeEntity } from '../BaseTimeEntity';
import { NotFoundException } from '@nestjs/common';

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

  async validatePassword(password: string) {
    const isMatch = await PasswordUtil.match(password, this.password);

    if (!isMatch) {
      throw new NotFoundException({
        message: '이메일 또는 비밀번호를 확인해주세요',
      });
    }
  }
}
