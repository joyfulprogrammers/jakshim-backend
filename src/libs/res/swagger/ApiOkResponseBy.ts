import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { CustomResponse } from './CustomResponse';

export function ApiOkResponseBy(...types: Parameters<typeof ApiExtraModels>) {
  return applyDecorators(
    ApiExtraModels(...types),
    ApiOkResponse(
      CustomResponse.by(
        types.length ? { $ref: getSchemaPath(types[0]) } : undefined,
      ),
    ),
  );
}
