import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class PasswordCharacter implements ValidatorConstraintInterface {
  validate(text: string): Promise<boolean> | boolean {
    return /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(text);
    // return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!"#$%&'()*+,=./:;<=>?@₩^_`{|}\]~\\[])(?!.*[^a-zA-Z0-9!"#$%&'()*+,=./:;<=>?@₩^_`{|}\]~\\[])/.test(
    //   text,
    // );
  }

  defaultMessage() {
    return '비밀번호는 영문과 숫자를 포함한 8자 이상의 문자열이어야 합니다.';
    // return 'password must contain lower and uppercase letters and special characters and digits';
  }
}
