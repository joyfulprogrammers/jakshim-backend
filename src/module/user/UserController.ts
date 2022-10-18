import { Body, Controller, Post } from '@nestjs/common';
import { UserSaveRequest } from './dto/UserSaveRequest';
import { UserService } from './UserService';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async save(@Body() req: UserSaveRequest) {
    await this.userService.save(req);
  }
}
