import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { User } from '../../../entity/domain/user/User.entity';

export class UserEmailDuplicationResponse {
  @Exclude() private readonly _user: User;
  constructor(user: User) {
    this._user = user;
  }

  @ApiProperty({
    type: 'boolean',
    description: '이메일 중복 여부',
  })
  @Expose()
  get isDuplicated() {
    return this._user !== null;
  }
}
