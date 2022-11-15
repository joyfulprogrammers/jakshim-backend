import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { password } from '../../../module/user/decorator/password';
import { Trim } from '../../../decorator/Trim';
import { User } from '../../../entity/domain/user/User.entity';

export class AuthSignUpRequest {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Trim()
  email: string;

  @password({ required: true })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  nickname: string;

  async toEntity(): Promise<User> {
    const user = await User.signup(this.email, this.password, this.nickname);

    return user;
  }
}
