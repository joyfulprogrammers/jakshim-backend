import { Type } from '@mikro-orm/core';

export class EnumType<T> extends Type<T | null, string> {
  constructor(private readonly value: NonNullable<T>) {
    super();
  }

  override convertToDatabaseValue(value: T | string | null): string {
    if (!value) {
      return null as any;
    }

    if (typeof value === 'string') {
      return value;
    }

    return (value as any).code;
  }

  override convertToJSValue(value: T | string | null): T | null {
    if (typeof value === 'string') {
      return (this.value as any).find(value);
    }

    return value;
  }

  override getColumnType() {
    return 'varchar(50)';
  }
}
