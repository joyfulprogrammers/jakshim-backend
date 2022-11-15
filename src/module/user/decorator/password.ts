import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PasswordCharacter } from './validator/PasswordCharacter';
import { NotRepeatSameCharacter } from './validator/NotRepeatSameCharacter';

export function password({
  required,
}: {
  required: boolean;
}): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    IsNotEmpty()(target, propertyKey);
    IsString()(target, propertyKey);
    MaxLength(32)(target, propertyKey);
    MinLength(8)(target, propertyKey);
    Transform(({ value }) =>
      typeof value === 'string' ? value.trim() : value,
    )(target, propertyKey);
    Validate(PasswordCharacter)(target, propertyKey);
    Validate(NotRepeatSameCharacter)(target, propertyKey);

    if (required) {
      IsDefined({ message: 'Must specify a receiver' })(target, propertyKey);
    } else {
      IsOptional()(target, propertyKey);
    }
  };
}
