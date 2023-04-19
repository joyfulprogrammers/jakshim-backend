import { Type } from '@mikro-orm/core';
import { LocalTime } from '@js-joda/core';
import { DateTimeUtil } from '../util/DateTimeUtil';

export class LocalTimeType extends Type<LocalTime | null, string> {
  override convertToDatabaseValue(value: LocalTime): string {
    if (!value) {
      return null as any;
    }

    return DateTimeUtil.toString(value);
  }

  override convertToJSValue(value: string): LocalTime | null {
    if (!value) {
      return null;
    }

    return DateTimeUtil.toLocalTimeBy(value);
  }

  override getColumnType() {
    return `time`;
  }
}
