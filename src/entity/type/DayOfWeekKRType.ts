import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class DayOfWeekKRType extends EnumType<DayOfWeekKRType>() {
  static readonly SUNDAY = new DayOfWeekKRType('sunday', '일요일');
  static readonly MONDAY = new DayOfWeekKRType('monday', '월요일');
  static readonly TUESDAY = new DayOfWeekKRType('tuesday', '화요일');
  static readonly WEDNESDAY = new DayOfWeekKRType('wednesday', '수요일');
  static readonly THURSDAY = new DayOfWeekKRType('thursday', '목요일');
  static readonly FRIDAY = new DayOfWeekKRType('friday', '금요일');
  static readonly SATURDAY = new DayOfWeekKRType('saturday', '토요일');

  private constructor(
    private readonly _code: string,
    private readonly _name: string,
  ) {
    super();
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }
}
