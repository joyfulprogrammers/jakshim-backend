import { IsString } from 'class-validator';

export class UserSaveRequest {
  @IsString()
  nickname: string;
}
