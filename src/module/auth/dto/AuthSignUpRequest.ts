import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { password } from '../../user/decorator/password';
import { Trim } from '../../../decorator/Trim';
import { User } from '../../../entity/domain/user/User.entity';

export class AuthSignUpRequest {
  @ApiProperty({
    example: 'rla123@gmail.com',
    description: '이메일',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Trim()
  email: string;

  @ApiProperty({
    example: 'rla123123!',
    description: '비밀번호',
  })
  @password({ required: true })
  password: string;

  @ApiProperty({
    example: '습관 천재',
    description: '닉네임',
  })
  @IsString()
  @IsNotEmpty()
  @Trim()
  nickname: string;

  async toEntity(): Promise<User> {
    const user = await User.signup(this.email, this.password, this.nickname);

    return user;
  }
}
