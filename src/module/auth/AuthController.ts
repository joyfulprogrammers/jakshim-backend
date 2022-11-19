import {
  Controller,
  Post,
  BadRequestException,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ResponseStatus } from '../../libs/res/ResponseStatus';
import { ResponseEntity } from '../../libs/res/ResponseEntity';
import { AuthSessionDto } from './dto/AuthSessionDto';
import { AuthService } from './AuthService';
import { AuthSignInRequest } from './dto/AuthSignInRequest';
import { validate, ValidationError } from 'class-validator';
import { Request } from 'express';
import { Session } from '../../decorator/Session';
import { AuthSignUpRequest } from './dto/AuthSignupRequest';
import { AuthLocalGuard } from './guard/AuthLocalGuard';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
        console.error(`관리자 로그인 실패`, error);
        errorCode = ResponseStatus.SERVER_ERROR;
      }

      return ResponseEntity.ERROR_WITH(error.message, errorCode);
    }
  }

  @Post('/signup')
  @ApiOperation({
    summary: '회원가입 API',
    description: '회원가입을 합니다.',
  })
  @ApiCreatedResponse({
    description: '회원가입',
    type: ResponseEntity,
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
