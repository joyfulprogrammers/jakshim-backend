import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../decorator/Trim';

export class AuthSignUpRequest {
  @IsString()
  @IsNotEmpty()
  @Trim()
  nickname: string;
}
