import {
  BadRequestException,
  Controller,
  Get,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './UserService';
import { LoggedInGuard } from '../auth/guard/LoggedInGuard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseEntity } from 'src/libs/res/ResponseEntity';
import { ResponseStatus } from 'src/libs/res/ResponseStatus';
import { AuthSessionDto } from '../auth/dto/AuthSessionDto';

@UseGuards(LoggedInGuard)
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiOperation({
    summary: '로그인한 유저 정보 API',
    description: '로그인한 유저 정보를 가져옵니다.',
  })
  async getUser(@Session() user: AuthSessionDto) {
    try {
      return ResponseEntity.OK_WITH<AuthSessionDto>(user);
    } catch (error) {
      let errorCode: ResponseStatus;

      if (error instanceof BadRequestException) {
        errorCode = ResponseStatus.BAD_REQUEST;
      } else {
        // eslint-disable-next-line no-console
        console.error(`관리자 로그인 실패`, error);
        errorCode = ResponseStatus.SERVER_ERROR;
      }

      return ResponseEntity.ERROR_WITH(error.message, errorCode);
    }
  }
}
