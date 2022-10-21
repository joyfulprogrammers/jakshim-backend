import { convert, LocalDate, nativeJs } from '@js-joda/core';
import { Type } from '@mikro-orm/core';

export class LocalDateType extends Type<LocalDate | null, Date> {
  override convertToDatabaseValue(value: LocalDate | Date): Date {
    if (!value) {
      return null as any;
    }

    if (value instanceof Date) {
      return value;
    }

    return convert(value).toDate();
  }

  override convertToJSValue(
    value: LocalDate | Date | number | null,
  ): LocalDate | null {
    if (!value) {
      return null;
    }

    if (value instanceof LocalDate) {
      return value;
    }

    if (typeof value === 'number') {
      return LocalDate.from(nativeJs(new Date(value)));
    }

    return LocalDate.from(nativeJs(new Date(value)));
  }

  override getColumnType() {
    return `timestamptz`;
  }
}
