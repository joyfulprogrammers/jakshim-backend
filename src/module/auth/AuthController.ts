import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ResponseStatus } from '../../libs/res/ResponseStatus';
import { ResponseEntity } from '../../libs/res/ResponseEntity';
import { AuthSessionDto } from './dto/AuthSessionDto';
import { AuthService } from './AuthService';
import { Session } from '../../decorator/Session';
import { AuthSignUpRequest } from './dto/AuthSignupRequest';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthSignInRequest } from './dto/AuthSignInRequest';
import { NotLoggedInGuard } from './guard/NotLoggedInGuard';
import { AuthLocalGuard } from './guard/AuthLocalGuard';

@ApiTags('AUTH')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthLocalGuard)
  @Post('/signin')
  @ApiOperation({
    summary: '로그인 API',
    description: '로그인을 합니다.',
  })
  @ApiBody({
    type: AuthSignInRequest,
    examples: {
      test: {
        summary: '테스트',
        description: '테스트용 아이디/비밀번호',
        value: {
          email: 'rla123@gmail.com',
          password: 'rla123123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
  })
  async signIn(@Session() authSessionDto: AuthSessionDto) {
    try {
      return ResponseEntity.OK_WITH<AuthSessionDto>(authSessionDto);
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

  @UseGuards(NotLoggedInGuard)
  @Post('/signup')
  @ApiOperation({
    summary: '회원가입 API',
    description: '회원가입을 합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '회원가입 성공',
  })
  async signUp(
    @Body() body: AuthSignUpRequest,
  ): Promise<ResponseEntity<string>> {
    try {
      await this.authService.signup(body);

      return ResponseEntity.OK();
    } catch (error) {
      let errorCode: ResponseStatus;

      if (error instanceof BadRequestException) {
        errorCode = ResponseStatus.BAD_REQUEST;
      } else {
        // eslint-disable-next-line no-console
        console.error(`관리자 회원가입 실패`, error);
        errorCode = ResponseStatus.SERVER_ERROR;
      }

      return ResponseEntity.ERROR_WITH(error.message, errorCode);
    }
  }
}
