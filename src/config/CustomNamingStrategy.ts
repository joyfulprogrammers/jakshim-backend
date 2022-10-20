import { UnderscoreNamingStrategy } from '@mikro-orm/core';

export class CustomNamingStrategy extends UnderscoreNamingStrategy {
  override indexName(
    tableName: string,
    columns: string[],
    type: 'primary' | 'foreign' | 'unique' | 'index' | 'sequence' | 'check',
  ): string {
    if (type === 'primary') {
      return `pk_${tableName}_${columns.join('_')}`;
    }

    if (type === 'index') {
      return `idx_${tableName}_${columns.join('_')}`;
    }

    if (type === 'unique') {
      return `uni_${tableName}_${columns.join('_')}`;
    }

    return super.indexName(tableName, columns, type);
  }
}
