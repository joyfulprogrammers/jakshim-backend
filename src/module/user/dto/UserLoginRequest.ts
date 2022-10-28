import { IsString } from 'class-validator';

export class UserLoginRequest {
  @IsString()
  nickname: string;
}
