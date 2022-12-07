// this file was generated via custom migration generator

import { Migration } from '@mikro-orm/migrations';

export class Migration20221207 extends Migration {
  async up(): Promise<void> {
    this.addSql(`alter table habits
    drop column cycle_month;`);
    this.addSql(`comment on column "posts"."slug" is 'slug';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table habits
    add cycle_month boolean not null;`);
    this.addSql(
      `comment on column habits.cycle_month is '주기가 한 달인지 여부';`,
    );
  }
}
