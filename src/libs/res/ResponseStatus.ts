/**
 * http status 가 200이면서 서버 오류 (우리가 핸들링 가능한 에러)일 경우 아래를 사용
 * http status 가 500인 경우는 인프라가 아예 작동 불가능한 상태
 * - express server가 죽은 경우
 * - Load Balancer 가 죽은 경우
 */
export enum ResponseStatus {
  OK = 'OK',
  SERVER_ERROR = 'SERVER_ERROR',
  DUPLICATE = 'DUPLICATE',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  BAD_PARAMETER = 'BAD_PARAMETER',
  CONFLICT = 'CONFLICT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',
  TOO_MANY_REQUEST = 'TOO_MANY_REQUEST',
  GONE = 'GONE',
}
