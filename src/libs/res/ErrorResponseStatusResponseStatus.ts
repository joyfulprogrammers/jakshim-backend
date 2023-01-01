import { ResponseStatus } from './ResponseStatus';

export class ErrorResponseStatus {
  static readonly BAD_PARAMETER = new ErrorResponseStatus(
    ResponseStatus.BAD_PARAMETER,
    '요청 값에 문제가 있습니다.',
  );

  static readonly PAYLOAD_TOO_LARGE = new ErrorResponseStatus(
    ResponseStatus.PAYLOAD_TOO_LARGE,
    '제한된 요청 항목 크기를 초과했습니다.',
  );

  static readonly BAD_IMAGE_REQUEST = new ErrorResponseStatus(
    ResponseStatus.BAD_PARAMETER,
    '5MB 이하의 jpg, png, jpeg 파일만 업로드 가능합니다.',
  );

  constructor(
    private readonly _code: ResponseStatus,
    private readonly _message: string,
  ) {}

  get code(): ResponseStatus {
    return this._code;
  }

  get message(): string {
    return this._message;
  }
}
