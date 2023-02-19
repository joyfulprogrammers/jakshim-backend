import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class AuthCheckResponse {
  @Exclude() private readonly _isLoggedIn: boolean;

  constructor(isLoggedIn: boolean) {
    this._isLoggedIn = isLoggedIn;
  }

  @ApiProperty({
    type: 'boolean',
    description: '로그인 여부',
  })
  @Expose()
  get isLoggedIn() {
    return this._isLoggedIn;
  }
}
