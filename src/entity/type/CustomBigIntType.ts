import { BigIntType } from '@mikro-orm/core';

export class CustomBigIntType extends BigIntType {
  override convertToJSValue(value: any): any {
    if (!value) {
      return value;
    }

    return Number(value);
  }
}
