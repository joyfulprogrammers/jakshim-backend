import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../decorator/Trim';

export class AuthSignInRequest {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Trim()
  nickname: string;
}
