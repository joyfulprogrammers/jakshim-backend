import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { PasswordRequest } from 'src/libs/req/PasswordRequest';
import { Trim } from '../../../decorator/Trim';

export class AuthSignInRequest extends PasswordRequest {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Trim()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Trim()
  override password: string;

  constructor() {
    super();
  }
}
