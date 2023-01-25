import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { User } from '../../../entity/domain/user/User.entity';

export class UserGetResponse {
  @Exclude() private readonly _user: User;

  constructor(user: User) {
    this._user = user;
  }

  @ApiProperty({
    type: 'number',
    description: 'user 아이디',
  })
  @Expose()
  get id() {
    return this._user.id;
  }

  @ApiProperty({
    type: 'string',
    description: 'user 닉네임',
  })
  @Expose()
  get nickname() {
    return this._user.nickname;
  }
}
