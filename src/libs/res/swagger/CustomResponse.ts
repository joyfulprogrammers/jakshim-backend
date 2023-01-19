import { ApiResponseOptions, ApiResponseSchemaHost } from '@nestjs/swagger';
import { ResponseStatus } from '../ResponseStatus';

export class CustomResponse {
  static by(data?: ApiResponseSchemaHost['schema']): ApiResponseOptions {
    return {
      schema: {
        properties: {
          statusCode: {
            type: 'string',
            enum: [ResponseStatus.OK],
          },
          message: {
            type: 'string',
          },
          data: data || {
            type: 'string',
          },
        },
      },
    };
  }
}
