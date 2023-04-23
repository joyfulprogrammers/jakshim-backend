import { DayOfWeekKRType } from '../type/DayOfWeekKRType';
import {
  convert,
  DateTimeFormatter,
  LocalDate,
  LocalDateTime,
  LocalTime,
  nativeJs,
} from '@js-joda/core';
import { Locale } from '@js-joda/locale_ko';

export class DateTimeUtil {
  private static DATE_FORMATTER = DateTimeFormatter.ofPattern('yyyy-MM-dd');
  private static DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(
    'yyyy-MM-dd HH:mm:ss',
  );
  private static TIME_FORMATTER = DateTimeFormatter.ofPattern('HH:mm');

  static format(localDate: LocalDate | LocalDateTime, pattern: string): string {
    const dateString = localDate.format(
      DateTimeFormatter.ofPattern(pattern).withLocale(Locale.KOREAN),
    );

    return dateString.replace('AM', '오전').replace('PM', '오후');
  }

  static toString(
    localDate: LocalDate | LocalDateTime | LocalTime | null,
  ): string {
    if (!localDate) {
      return '';
    }

    if (localDate instanceof LocalTime) {
      return localDate.format(this.TIME_FORMATTER);
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

  static toMilliseconds(localDate: LocalDate | LocalDateTime): number {
    return DateTimeUtil.toDate(localDate).getTime();
  }

  static toUnixTime(localDate: LocalDate | LocalDateTime): number {
    return Math.ceil(DateTimeUtil.toMilliseconds(localDate) / 1000);
  }

  static toDate(localDate: LocalDate | LocalDateTime): Date {
    return convert(localDate).toDate();
  }

  static toLocalDate(date: Date): LocalDate {
    return LocalDate.from(nativeJs(date));
  }

  static toLocalDateTime(date: Date): LocalDateTime {
    return LocalDateTime.from(nativeJs(date));
  }

  static toLocalTimeBy(strDate: string): LocalTime | null {
    if (!strDate) {
      return null;
    }

    return LocalTime.parse(
      this.removeMillisecond(strDate),
      DateTimeUtil.TIME_FORMATTER,
    );
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

  static getLocalTimeMin(): LocalTime {
    return LocalTime.of(0, 0);
  }

  static getLocalTimeMax(): LocalTime {
    return LocalTime.of(23, 59);
  }

  static getTodayMin(): LocalDateTime {
    return LocalDate.now().atStartOfDay();
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

  static convertToKrDay(value: LocalDate): DayOfWeekKRType {
    const dayOfWeek = value.dayOfWeek().value();

    switch (dayOfWeek % 7) {
      case 0:
        return DayOfWeekKRType.SUNDAY;
      case 1:
        return DayOfWeekKRType.MONDAY;
      case 2:
        return DayOfWeekKRType.TUESDAY;
      case 3:
        return DayOfWeekKRType.WEDNESDAY;
      case 4:
        return DayOfWeekKRType.THURSDAY;
      case 5:
        return DayOfWeekKRType.FRIDAY;
      case 6:
      default:
        return DayOfWeekKRType.SATURDAY;
    }
  }

  private static doesHaveMillisecond(time: string): boolean {
    return time.split(':').length === 3;
  }

  private static removeMillisecond(time: string): string {
    return this.doesHaveMillisecond(time) ? time.replace(/:[\d]+$/, '') : time;
  }
}
