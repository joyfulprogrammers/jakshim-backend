import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../decorator/Trim';

export class AuthSignInRequest {
  @IsString()
  @IsNotEmpty()
  @Trim()
  nickname: string;
}
