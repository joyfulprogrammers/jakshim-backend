import { Exclude, Expose } from 'class-transformer';
import { User } from '../../../entity/domain/user/User.entity';

export class AuthSessionDto {
  isFirstSignIn?: boolean;
  @Exclude() private readonly _id: number;

  constructor(id: number) {
    this._id = id;
  }

  static create(user: User): AuthSessionDto {
    return new AuthSessionDto(user.id);
  }

  @Expose()
  get id(): number {
    return this._id;
  }
}
