import {
  convert,
  DateTimeFormatter,
  LocalDate,
  LocalDateTime,
  nativeJs,
} from '@js-joda/core';

export class DateTimeUtil {
  private static DATE_FORMATTER = DateTimeFormatter.ofPattern('yyyy-MM-dd');
  private static DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(
    'yyyy-MM-dd HH:mm:ss',
  );

  static toString(localDate: LocalDate | LocalDateTime | null): string {
    if (!localDate) {
      return '';
    }

    if (localDate instanceof LocalDate) {
      return localDate.format(this.DATE_FORMATTER);
    }

    return localDate.format(this.DATE_TIME_FORMATTER);
  }

  static toStringFormatDate(date: Date | null): string {
    if (!date) {
      return '';
    }

    return this.toString(this.toLocalDate(date));
  }

  static toStringFormatDateTime(date: Date | null): string {
    if (!date) {
      return '';
    }

    return this.toString(this.toLocalDateTime(date));
  }

  static toDate(localDate: LocalDate | LocalDateTime): Date | null {
    if (!localDate) {
      return null;
    }

    return convert(localDate).toDate();
  }

  static toLocalDate(date: Date): LocalDate | null {
    if (!date) {
      return null;
    }
    return LocalDate.from(nativeJs(date));
  }

  static toLocalDateTime(date: Date): LocalDateTime | null {
    if (!date) {
      return null;
    }
    return LocalDateTime.from(nativeJs(date));
  }

  static getLocalDateMin(): LocalDate {
    return LocalDate.of(1970, 1, 1);
  }

  static getLocalDateMax(): LocalDate {
    return LocalDate.of(9999, 12, 31);
  }

  static getLocalDateTimeMin(): LocalDateTime {
    return LocalDateTime.of(1970, 1, 1, 0, 0, 0);
  }

  static getLocalDateTimeMax(): LocalDateTime {
    return LocalDateTime.of(9999, 12, 31, 23, 59, 59);
  }

  static toLocalDateBy(strDate: string): LocalDate | null {
    if (!strDate) {
      return null;
    }

    return LocalDate.parse(strDate, DateTimeUtil.DATE_FORMATTER);
  }

  static toLocalDateTimeBy(strDate: string): LocalDateTime | null {
    if (!strDate) {
      return null;
    }

    return LocalDateTime.parse(strDate, DateTimeUtil.DATE_TIME_FORMATTER);
  }

  static isEqualsOrBefore(source: LocalDate, target: LocalDate): boolean;
  static isEqualsOrBefore(
    source: LocalDateTime,
    target: LocalDateTime,
  ): boolean;
  static isEqualsOrBefore(source: any, target: any) {
    return source.isEqual(target) || source.isBefore(target);
  }

  static isEqualsOrAfter(source: LocalDate, target: LocalDate): boolean;
  static isEqualsOrAfter(source: LocalDateTime, target: LocalDateTime): boolean;
  static isEqualsOrAfter(source: any, target: any) {
    return source.isEqual(target) || source.isAfter(target);
  }

  static convertToLocalDate(value: LocalDate | string | unknown) {
    if (typeof value === 'string') {
      return DateTimeUtil.toLocalDateBy(value);
    }

    return value;
  }
}
