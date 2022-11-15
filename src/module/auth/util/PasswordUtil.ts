import { BadRequestException, ConflictException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

export class PasswordUtil {
  private static readonly round = 10;

  static async encrypt(password: string): Promise<string> {
    if (!password) {
      throw new BadRequestException(`패스워드가 존재 하지 않습니다.`);
    }

    return hash(password, this.round);
  }

  static async match(
    password: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    this.validatePassword(password);
    this.validateEncryptedPassword(encryptedPassword);

    return compare(password, encryptedPassword);
  }

  static validatePassword(password: string) {
    if (!password) {
      throw new BadRequestException(`패스워드가 존재하지 않습니다.`);
    }
  }

  static validateEncryptedPassword(encryptedPassword: string) {
    if (!encryptedPassword) {
      throw new ConflictException(`암호화된 패스워드가 존재하지 않습니다.`);
    }
  }
}
