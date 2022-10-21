import { CustomBigIntType } from '../type/CustomBigIntType';
import { LocalDateTimeType } from '../type/LocalDateTimeType';
import { LocalDateTime } from '@js-joda/core';
import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class BigIntegerBaseTimeEntity {
  @PrimaryKey({ type: CustomBigIntType, columnType: 'bigserial' })
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
