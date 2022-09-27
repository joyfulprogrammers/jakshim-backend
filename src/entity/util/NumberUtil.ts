export class NumberUtil {
  static isNumeric(data: unknown): boolean {
    if (typeof data === 'number') {
      return true;
    }

    if (typeof data === 'string') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return data - parseFloat(data) + 1 >= 0;
    }

    return false;
  }
}
