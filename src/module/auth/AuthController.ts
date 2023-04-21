import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ResponseStatus } from '../../libs/res/ResponseStatus';
import { ResponseEntity } from '../../libs/res/ResponseEntity';
import { AuthSessionDto } from './dto/AuthSessionDto';
import { AuthService } from './AuthService';
import { Session } from '../../decorator/Session';
import { AuthSignInRequest } from './dto/AuthSignInRequest';
import { NotLoggedInGuard } from './guard/NotLoggedInGuard';
import { AuthLocalGuard } from './guard/AuthLocalGuard';
import { UserService } from '../user/UserService';
import { AuthCheckResponse } from './dto/AuthCheckResponse';
import { ApiOkResponseBy } from '../../libs/res/swagger/ApiOkResponseBy';
import { AuthSignUpRequest } from './dto/AuthSignUpRequest';

@ApiTags('AUTH')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

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

  @Get('/check')
  @ApiOperation({
    summary: '로그인 체크 API',
    description: '로그인한 유저가 있는지 체크하고 정보를 가져옵니다.',
  })
  @ApiOkResponseBy(AuthCheckResponse)
  async check(@Req() request: any) {
    try {
      if (!request.session || !request.session.passport) {
        return ResponseEntity.OK_WITH<AuthCheckResponse>(
          new AuthCheckResponse(false),
        );
      }
      const user = request.session.passport.user;
      const foundUser = await this.userService.find(user.id);

      return ResponseEntity.OK_WITH<AuthCheckResponse>(
        new AuthCheckResponse(!!foundUser),
      );
    } catch (error) {
      let errorCode: ResponseStatus;

      if (error instanceof BadRequestException) {
        errorCode = ResponseStatus.BAD_REQUEST;
      } else {
        // eslint-disable-next-line no-console
        console.error(`로그인 체크 실패`, error);
        errorCode = ResponseStatus.SERVER_ERROR;
      }

      return ResponseEntity.ERROR_WITH(error.message, errorCode);
    }
  }

  @Post('/logout')
  @ApiOperation({
    summary: '로그아웃 API',
    description: '로그아웃을 합니다.',
  })
  async logout(@Req() request: any) {
    try {
      const responsePromise = new Promise((resolve, reject) => {
        request.logout(function logoutCallback(error: Error) {
          if (error) {
            reject(new Error('로그아웃 실패'));
          }

          resolve(ResponseEntity.OK());
        });
      });

      return await responsePromise;
    } catch (error) {
      let errorCode: ResponseStatus;

      if (error instanceof BadRequestException) {
        errorCode = ResponseStatus.BAD_REQUEST;
      } else {
        // eslint-disable-next-line no-console
        console.error(`로그아웃 실패`, error);
        errorCode = ResponseStatus.SERVER_ERROR;
      }

      return ResponseEntity.ERROR_WITH(error.message, errorCode);
    }
  }
}
