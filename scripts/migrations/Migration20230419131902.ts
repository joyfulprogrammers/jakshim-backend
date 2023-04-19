// this file was generated via custom migration generator

import { Migration } from '@mikro-orm/migrations';

export class Migration20230419131902 extends Migration {

  async up(): Promise<void> {
    this.addSql(`alter table
                   "habits"
                 add column
                   "started_time" time null,
                 add column
                   "ended_time" time null;`);
    this.addSql(`comment
                   on column "habits"."started_time" is '습관 시작 시간';`);
    this.addSql(`comment
                   on column "habits"."ended_time" is '습관 종료 시간';`);
    this.addSql(`alter table
                   "habits"
                 drop column
                   "started_at";`);
    this.addSql(`alter table
                   "habits"
                 drop column
                   "ended_at";`);
  }

  async down(): Promise<void> {
    this.addSql(`alter table
                   "habits"
                 add column
                   "started_at" timestamptz null,
                 add column
                   "ended_at" timestamptz null;`);
    this.addSql(`comment
                   on column "habits"."started_at" is '습관 시작 시간';`);
    this.addSql(`comment
                   on column "habits"."ended_at" is '습관 종료 시간';`);
    this.addSql(`alter table
                   "habits"
                 drop column
                   "started_time";`);
    this.addSql(`alter table
                   "habits"
                 drop column
                   "ended_time";`);
  }

}
