import { Transform } from 'class-transformer';
import { LocalTime } from '@js-joda/core';
import { DateTimeUtil } from '../entity/util/DateTimeUtil';

export function ToLocalTime() {
  return Transform(({ value }) => {
    if (value instanceof LocalTime) {
      return value;
    }

    return DateTimeUtil.toLocalTimeBy(value || 'invalid');
  });
}
