import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class NotRepeatSameCharacter implements ValidatorConstraintInterface {
  validate(text: string): Promise<boolean> | boolean {
    return !/(.)\1\1/.test(text);
  }

  defaultMessage() {
    return 'password can not repeat the same character more than three times.';
  }
}
