import { format, LoggerOptions, transports } from 'winston';

export function getWinstonOption(
  nodeEnv = process.env.NODE_ENV,
): LoggerOptions {
  const isLocal = nodeEnv === 'local';

  return {
    silent: isLocal,
    transports: [
      new transports.Console({
        level: isLocal ? 'debug' : 'info',
        format: getFormat(),
      }),
    ],
  };
}

function getFormat(): any {
  return format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.printf(({ message, stack }) =>
      [message, stack].filter(Boolean).join('\n'),
    ),
  );
}
