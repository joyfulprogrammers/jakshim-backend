import { Controller } from '@nestjs/common';
import { UserService } from './UserService';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
