import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../decorator/Trim';
import { PasswordRequest } from '../../../libs/req/PasswordRequest';

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
