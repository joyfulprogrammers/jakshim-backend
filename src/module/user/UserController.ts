import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './UserService';
import { LoggedInGuard } from '../auth/guard/LoggedInGuard';

@UseGuards(LoggedInGuard)
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
}
