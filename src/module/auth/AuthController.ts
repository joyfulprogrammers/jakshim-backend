import {
  Controller,
  Post,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ResponseStatus } from '../../libs/res/ResponseStatus';
import { ResponseEntity } from '../../libs/res/ResponseEntity';
import { Session } from '../../decorator/Session';
import { AuthSessionDto } from './dto/AuthSessionDto';
import { AuthLocalGuard } from './guard/AuthLocalGuard';

@Controller('api/auth')
export class AuthController {
  @UseGuards(AuthLocalGuard)
  @Post('/signin')
  async signIn(@Session() authSessionDto: AuthSessionDto) {
    try {
      return ResponseEntity.OK_WITH<AuthSessionDto>(authSessionDto);
    } catch (error) {
      let errorCode: ResponseStatus;

      if (error instanceof BadRequestException) {
        errorCode = ResponseStatus.BAD_REQUEST;
      } else {
        // eslint-disable-next-line no-console
        console.error(
          `관리자 로그인 실패: sessionDto=${JSON.stringify(authSessionDto)}`,
          error,
        );
        errorCode = ResponseStatus.SERVER_ERROR;
      }

      return ResponseEntity.ERROR_WITH(error.message, errorCode);
    }
  }
}
