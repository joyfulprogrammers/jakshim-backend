export const SessionName = 'connect.jakshim.sid';

export const SessionConstant = {
  SESSION_NAME: SessionName,
  SESSION_OPTION: Symbol('SESSION_OPTION'),
  REDIS: Symbol('REDIS'),
} as const;
