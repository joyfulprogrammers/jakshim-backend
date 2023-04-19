// this file was generated via custom migration generator

import { Migration } from '@mikro-orm/migrations';

export class Migration20230419092223 extends Migration {
  async up(): Promise<void> {
    this.addSql(`create table "users"
                 (
                     "id"         serial,
                     "created_at" timestamptz  not null,
                     "updated_at" timestamptz null,
                     "email"      varchar(255) not null,
                     "password"   varchar(255) null,
                     "nickname"   varchar(255) not null,
                     constraint "pk_users_id" primary key ("id")
                 );`);
    this.addSql(`comment
                   on column "users"."email" is '사용자 이메일';`);
    this.addSql(`comment
                   on column "users"."password" is '사용자 비밀번호';`);
    this.addSql(`comment
                   on column "users"."nickname" is '사용자 닉네임';`);
    this.addSql(`create table "habits"
                 (
                     "id"              serial,
                     "created_at"      timestamptz  not null,
                     "updated_at"      timestamptz null,
                     "user_id"         int          not null,
                     "name"            varchar(255) not null,
                     "target_count"    int          not null,
                     "started_at"      timestamptz null,
                     "ended_at"        timestamptz null,
                     "is_all_day"      boolean      not null,
                     "cycle_monday"    boolean      not null,
                     "cycle_tuesday"   boolean      not null,
                     "cycle_wednesday" boolean      not null,
                     "cycle_thursday"  boolean      not null,
                     "cycle_friday"    boolean      not null,
                     "cycle_saturday"  boolean      not null,
                     "cycle_sunday"    boolean      not null,
                     "cycle_week"      boolean      not null,
                     "deleted_at"      timestamptz null,
                     constraint "pk_habits_id" primary key ("id")
                 );`);
    this.addSql(`comment on column "habits"."name" is '습관 이름';`);
    this.addSql(`comment
                   on column "habits"."target_count" is '습관 달성 기준 횟수';`);
    this.addSql(`comment
                   on column "habits"."started_at" is '습관 시작 시간';`);
    this.addSql(`comment
                   on column "habits"."ended_at" is '습관 종료 시간';`);
    this.addSql(`comment
                   on column "habits"."is_all_day" is '하루 종일 달성 가능한 습관 여부';`);
    this.addSql(`comment
                   on column "habits"."cycle_monday" is '주기에 월요일 포함 여부';`);
    this.addSql(`comment
                   on column "habits"."cycle_tuesday" is '주기에 화요일 포함 여부';`);
    this.addSql(`comment
                   on column "habits"."cycle_wednesday" is '주기에 수요일 포함 여부';`);
    this.addSql(`comment
                   on column "habits"."cycle_thursday" is '주기에 목요일 포함 여부';`);
    this.addSql(`comment
                   on column "habits"."cycle_friday" is '주기에 금요일 포함 여부';`);
    this.addSql(`comment
                   on column "habits"."cycle_saturday" is '주기에 토요일 포함 여부';`);
    this.addSql(`comment
                   on column "habits"."cycle_sunday" is '주기에 일요일 포함 여부';`);
    this.addSql(`comment
                   on column "habits"."cycle_week" is '주기가 일주일인지 여부';`);
    this.addSql(`comment
                   on column "habits"."deleted_at" is '삭제 시각';`);
    this.addSql(`create index
        "idx_habits_user_id" on "habits" ("user_id");`);
    this.addSql(`create table
                     "badhabits"
                 (
                     "id"         serial,
                     "created_at" timestamptz  not null,
                     "updated_at" timestamptz null,
                     "user_id"    int          not null,
                     "name"       varchar(255) not null,
                     constraint "pk_badhabits_id" primary key ("id")
                 );`);
    this.addSql(`comment
                   on column "badhabits"."name" is '부정습관 이름';`);
    this.addSql(`create index
        "idx_badhabits_user_id" on "badhabits" ("user_id");`);
    this.addSql(`create table
                     "habit_badhabit"
                 (
                     "habit_id"    int not null,
                     "badhabit_id" int not null,
                     constraint "pk_habit_badhabit_habit_id_badhabit_id" primary key ("habit_id", "badhabit_id")
                 );`);
    this.addSql(`create table
                     "achievements"
                 (
                     "id"           serial,
                     "created_at"   timestamptz not null,
                     "updated_at"   timestamptz null,
                     "user_id"      int         not null,
                     "habit_id"     int         not null,
                     "target_count" int         not null,
                     "count"        int         not null,
                     constraint "pk_achievements_id" primary key ("id")
                 );`);
    this.addSql(`comment
                   on column "achievements"."target_count" is '습관 달성 기준 횟수. count가 targetCount에 도달하면 달성으로 처리';`);
    this.addSql(`comment
                   on column "achievements"."count" is '습관 횟수';`);
    this.addSql(`create index
        "idx_achievements_user_id" on "achievements" ("user_id");`);
    this.addSql(`create index
        "idx_achievements_habit_id" on "achievements" ("habit_id");`);
  }
}
