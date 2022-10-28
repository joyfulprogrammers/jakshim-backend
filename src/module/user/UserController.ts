import { Body, Controller, Post } from '@nestjs/common';
import { UserLoginRequest } from './dto/UserLoginRequest';
import { UserSaveRequest } from './dto/UserSaveRequest';
import { UserService } from './UserService';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async save(@Body() req: UserSaveRequest) {
    return await this.userService.save(req);
  }

  @Post('/login')
  async login(@Body() req: UserLoginRequest) {
    const result = await this.userService.login(req);

    return !!result;
  }
}
