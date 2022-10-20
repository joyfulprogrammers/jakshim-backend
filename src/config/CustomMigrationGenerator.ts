import { TSMigrationGenerator } from '@mikro-orm/migrations';
import { format } from 'sql-formatter';

export class CustomMigrationGenerator extends TSMigrationGenerator {
  override generateMigrationFile(
    className: string,
    diff: { up: string[]; down: string[] },
  ): string {
    const comment =
      '// this file was generated via custom migration generator\n\n';

    return comment + super.generateMigrationFile(className, diff);
  }

  override createStatement(sql: string, padLeft: number): string {
    if (!sql) {
      return '';
    }

    sql = format(sql, { language: 'postgresql' })
      .split('\n')
      .map((l, i) => (i === 0 ? l : `${' '.repeat(padLeft + 13)}${l}`))
      .join('\n');

    return super
      .createStatement('REPLACE', padLeft)
      .replace(`'REPLACE'`, '`' + sql + '`');
  }
}
