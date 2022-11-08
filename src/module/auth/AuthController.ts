import {
  Controller,
  Post,
  BadRequestException,
  Body,
  Req,
} from '@nestjs/common';
import { ResponseStatus } from '../../libs/res/ResponseStatus';
import { ResponseEntity } from '../../libs/res/ResponseEntity';
import { AuthSessionDto } from './dto/AuthSessionDto';
import { AuthService } from './AuthService';
import { AuthSignInRequest } from './dto/AuthSignInRequest';
import { validate, ValidationError } from 'class-validator';
import { Request } from 'express';
import { Session } from '../../decorator/Session';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signIn(
    @Session() authSessionDto: AuthSessionDto,
    @Req() request: Request,
    @Body() body: AuthSignInRequest,
  ) {
    try {
      const sess = request.session;
      const validationErrors: ValidationError[] = await validate(body);

      if (ValidationError.length > 0) {
        throw new BadRequestException(validationErrors);
      }

      console.log('sess', sess);

      const result = await this.authService.validateUser(body.nickname);

      if (result) {
        // (sess as any).userId = `${result.id}`;
        return ResponseEntity.OK_WITH<AuthSessionDto>(
          AuthSessionDto.create(result),
        );
      }

      throw new Error('유효하지 않은 닉네임입니다.');
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
