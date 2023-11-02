import { FormatQueryInterceptor } from '../../../../src/libs/web-common/interceptor/FormatQueryInterceptor';
import { of } from 'rxjs';

describe('FormatQueryInterceptor', () => {
  const interceptor = new FormatQueryInterceptor();

  it('query 값에 null byte가 포함되어 있을 경우 공백으로 치환한다', (done) => {
    // given
    const context: any = {
      switchToHttp: function () {
        return this;
      },
      getRequest: function () {
        return this.request;
      },
      request: {
        query: {
          key: 'value\0withNullByte',
        },
      },
    };
    const next = { handle: () => of('') };

    // when
    const result = interceptor.intercept(context, next);

    // then
    result.subscribe(() => {
      try {
        expect(context.switchToHttp().getRequest().query.key).toBe(
          'valuewithNullByte',
        );

        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
