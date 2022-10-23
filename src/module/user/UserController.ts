import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserSaveRequest } from './dto/UserSaveRequest';
import { UserService } from './UserService';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async save(@Body() req: UserSaveRequest) {
    await this.userService.save(req);
  }

  @Get()
  async find() {
    return {
      message: 'Hello World!',
    };
  }
}
