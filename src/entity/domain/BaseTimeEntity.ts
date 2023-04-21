import { PrimaryKey, Property } from '@mikro-orm/core';
import { LocalDateTime } from '@js-joda/core';
import { LocalDateTimeType } from '../type/LocalDateTimeType';

export abstract class BaseTimeEntity {
  @PrimaryKey()
  id: number;

  @Property({
    type: LocalDateTimeType,
    onCreate: () => LocalDateTime.now(),
  })
  readonly createdAt: LocalDateTime;

  @Property({
    type: LocalDateTimeType,
    onCreate: () => LocalDateTime.now(),
    onUpdate: () => LocalDateTime.now(),
  })
  readonly updatedAt: LocalDateTime;
}
