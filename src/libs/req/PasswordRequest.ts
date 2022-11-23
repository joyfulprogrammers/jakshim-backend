/* eslint-disable @typescript-eslint/no-unused-vars */
export class PasswordRequest {
  password: string;

  toString(): string {
    const { password, ...remaining } = this;

    return JSON.stringify(remaining);
  }

  toJSON() {
    const { password, ...remaining } = this;

    return remaining;
  }
}
