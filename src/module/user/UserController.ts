import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { UserService } from './UserService';
import { ApiOkResponseBy } from '../../libs/res/swagger/ApiOkResponseBy';
import { ResponseEntity } from '../../libs/res/ResponseEntity';
import { UserEmailDuplicationResponse } from './dto/UserEmailDuplicationResponse';
import { ResponseStatus } from '../../libs/res/ResponseStatus';

@ApiTags('USER')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/check-email')
  @ApiOperation({
    summary: '이메일 중복확인 API',
    description: '이메일 중복확인을 합니다.',
  })
  @ApiQuery({
    name: 'email',
    description: '이메일',
    required: true,
    type: String,
    example: 'rla123@gmail.com',
  })
  @ApiOkResponseBy(UserEmailDuplicationResponse)
  async checkEmailDuplication(@Query('email') email: string) {
    try {
      const user = await this.userService.findByEmail(email);

      return ResponseEntity.OK_WITH(new UserEmailDuplicationResponse(user));
    } catch (error) {
      let errorCode: ResponseStatus;

      if (error instanceof BadRequestException) {
        errorCode = ResponseStatus.BAD_REQUEST;
      } else {
        // eslint-disable-next-line no-console
        console.error(`이메일 중복 확인 실패`, error);
        errorCode = ResponseStatus.SERVER_ERROR;
      }

      return ResponseEntity.ERROR_WITH(error.message, errorCode);
    }
  }
}
