import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class PasswordCharacter implements ValidatorConstraintInterface {
  validate(text: string): Promise<boolean> | boolean {
    return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,=./:;<=>?@₩^_`{|}\]~\\[])(?!.*[^a-zA-Z0-9!"#$%&'()*+,=./:;<=>?@₩^_`{|}\]~\\[])/.test(
      text,
    );
  }

  defaultMessage() {
    return 'password must contain lower and uppercase letters and special characters and digits';
  }
}
