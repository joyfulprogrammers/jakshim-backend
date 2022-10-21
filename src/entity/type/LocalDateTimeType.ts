import { convert, LocalDateTime, nativeJs } from '@js-joda/core';
import { Type } from '@mikro-orm/core';

export class LocalDateTimeType extends Type<LocalDateTime | null, Date> {
  override convertToDatabaseValue(value: LocalDateTime | Date | null): Date {
    if (!value) {
      return null as any;
    }

    if (value instanceof Date) {
      return value;
    }

    return convert(value).toDate();
  }

  override convertToJSValue(
    value: LocalDateTime | Date | number | null,
  ): LocalDateTime | null {
    if (!value) {
      return null;
    }

    if (value instanceof LocalDateTime) {
      return value;
    }

    if (typeof value === 'number') {
      return LocalDateTime.from(nativeJs(new Date(value)));
    }

    return LocalDateTime.from(nativeJs(value));
  }

  override getColumnType() {
    return `timestamptz`;
  }
}
