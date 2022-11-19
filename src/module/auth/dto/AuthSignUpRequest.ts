import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { password } from '../../../module/user/decorator/password';
import { Trim } from '../../../decorator/Trim';
import { User } from '../../../entity/domain/user/User.entity';

export class AuthSignUpRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Trim()
  email: string;

  @ApiProperty()
  @password({ required: true })
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  nickname: string;

  async toEntity(): Promise<User> {
    const user = await User.signup(this.email, this.password, this.nickname);

    return user;
  }
}
