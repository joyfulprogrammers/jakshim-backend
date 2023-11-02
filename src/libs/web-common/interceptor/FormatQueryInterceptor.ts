import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FormatQueryInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (!request.query) {
      return next.handle();
    }

    request.query = Object.entries(request.query).reduce(
      (acc: Record<string, unknown>, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = value.replace(/\0/g, '');
        }

        return acc;
      },
      {},
    );

    return next.handle();
  }
}
